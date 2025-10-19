
import express, { Router } from 'express';
import {
  createShares,
  getShareById,
} from '../controllers/share.controller';

const router: Router = express.Router();

router.get('/:share_id', getShareById);
router.post('/', createShares);

export default router;
