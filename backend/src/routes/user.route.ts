
import express, { Router } from 'express';
import { getUserInfo, createUser, getUserByWallet } from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/:userId', getUserInfo);
router.post('/', createUser);
router.get("/wallet/:wallet_address", getUserByWallet); 

export default router;

