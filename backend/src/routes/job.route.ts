import express, { Router } from 'express';
import { createJob, getJobById } from '../controllers/job.controller';

const router : Router = express.Router();

router.post('/createjob', createJob);

router.get('/:id', getJobById);

export default router;
