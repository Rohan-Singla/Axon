import { Request, Response } from 'express';
import { PayoutModel } from '../models/payout.model';

export const createPayout = async (req: Request, res: Response) => {
  try {
    const { payout_id, miner_id, amount, tx_hash, paid_at } = req.body;

    if (!payout_id || !miner_id || amount == null || !paid_at) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await PayoutModel.insert({ payout_id, miner_id, amount, tx_hash, paid_at });
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
