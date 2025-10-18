import { Request, Response } from 'express';
import { JobModel } from '../models/job.model';
import crypto from 'crypto'; 

export const createJob = async (req: Request, res: Response) => {
  try {
    const { template_id, difficulty } = req.body;

    if (!template_id || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job_id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const newJob = { job_id, template_id, difficulty, created_at };
    
    await JobModel.insert(newJob);

    res.json({ message: '✅ Job inserted successfully', job: newJob });
  } catch (error) {
    console.error('Job insert error:', error);
    res.status(500).json({ error: 'Failed to insert job' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await JobModel.findById(req.params.id as string);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Fetch job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};
