import express, { Router } from 'express';
import { createPayout, getPayoutsByMiner } from '../controllers/payout.controller';

const router : Router = express.Router();

router.post('/', createPayout);

router.get('/:wallet_address', getPayoutsByMiner);

export default router;
