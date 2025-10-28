
import express, { Router } from 'express';
import { getUserInfo, createUser } from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/:userId', getUserInfo);
router.post('/', createUser);

export default router;

