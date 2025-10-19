import { Request, Response } from 'express';
import { JobModel, Job } from '../models/job.model';
import crypto from 'crypto';

export const createJobs = async (req: Request, res: Response) => {
  try {
    const jobsInput = req.body;

    if (!Array.isArray(jobsInput) || jobsInput.length === 0) {
      return res.status(400).json({ error: 'Jobs must be a non-empty array' });
    }

    const jobs: Job[] = jobsInput.map((job) => {
      if (!job.template_id || !job.difficulty) {
        throw new Error('Missing required fields in one of the jobs');
      }
      return {
        job_id: crypto.randomUUID(),
        template_id: job.template_id,
        difficulty: job.difficulty,
        created_at: new Date().toISOString(),
      };
    });

    for (const job of jobs) {
      await JobModel.insert(job);
    }

    res.json({ message: `✅ Inserted ${jobs.length} jobs successfully`, jobs });
  } catch (error) {
    console.error('Batch job insert error:', error);
    res.status(500).json({ error: 'Failed to insert jobs' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await JobModel.findById(id as string);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Fetch job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};
