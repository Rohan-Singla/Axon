import express, { Router } from 'express';
import { createJobs, getJobById } from '../controllers/job.controller';

const router : Router = express.Router();

router.post('/createjob', createJobs);

router.get('/:id', getJobById);

export default router;
