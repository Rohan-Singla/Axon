
import express, { Router } from 'express';
import {
  createShares,
  getMinerContribution,
  getShareById,
} from '../controllers/share.controller';

const router: Router = express.Router();

router.get('/:share_id', getShareById);
router.post('/', createShares);
router.get("/contribution/:miner_id", getMinerContribution);

export default router;
