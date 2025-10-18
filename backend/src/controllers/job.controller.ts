import { Request, Response } from 'express';
import { JobModel } from '../models/job.model';

export const createJob = async (req: Request, res: Response) => {
    try {
        const { job_id, template_id, difficulty, created_at } = req.body;

        if (!job_id || !template_id || !difficulty || !created_at) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await JobModel.insert({ job_id, template_id, difficulty, created_at });
        res.json({ message: '✅ Job inserted successfully' });
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
