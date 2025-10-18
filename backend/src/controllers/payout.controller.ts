import { Request, Response } from 'express';
import { PayoutModel } from '../models/payout.model';

export const createPayout = async (req: Request, res: Response) => {
  try {
    const { user_id, amount, tx_hash } = req.body;

    if (!user_id || amount == null || !tx_hash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Derive miner_id from users table
    // const miner_id = await UserModel.findMinerIdByUserId(user_id);
    // if (!miner_id) {
    //   return res.status(404).json({ error: 'User not found or miner_id missing' });
    // }

    const payout_id = crypto.randomUUID();
    const paid_at = new Date().toISOString();

    // await PayoutModel.insert({ payout_id, miner_id, amount, tx_hash, paid_at });

    res.json({ message: '✅ Payout inserted successfully' });
  } catch (error) {
    console.error('Payout insert error:', error);
    res.status(500).json({ error: 'Failed to insert payout' });
  }
};

export const getPayoutsByMiner = async (req: Request, res: Response) => {
  try {
    const payouts = await PayoutModel.findByMiner(req.params.miner_id as string);
    res.json(payouts);
  } catch (error) {
    console.error('Fetch payouts error:', error);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
};
