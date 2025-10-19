
import express, { Router } from 'express';
import {
  getShareById,
  createShare,
} from '../controllers/share.controller';

const router: Router = express.Router();

router.get('/:share_id', getShareById);
router.post('/', createShare);

export default router;
