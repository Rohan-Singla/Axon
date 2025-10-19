
import { Request, Response } from 'express';
import { ShareModel } from '../models/share.model';
import { Share } from '../models/share.model';

export const getShareById = async (req: Request, res: Response) => {
  try {
    const { share_id } = req.params;

    if (!share_id) {
      return res.status(400).json({ error: 'share_id is required' });
    }

    const share = await ShareModel.getShareById(share_id);

    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    res.status(200).json(share);
  } catch (error) {
    console.error('Error fetching share:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createShares = async (req: Request, res: Response) => {
  try {
    const sharesInput = req.body;

    if (!Array.isArray(sharesInput) || sharesInput.length === 0) {
      return res.status(400).json({ error: 'Shares must be a non-empty array' });
    }

    const shares: Share[] = sharesInput.map((share) => {
      if (!share.miner_id || !share.job_id || !share.difficulty) {
        throw new Error('Missing required fields in one of the shares');
      }
      return {
        share_id: crypto.randomUUID(),
        miner_id: share.miner_id,
        job_id: share.job_id,
        difficulty: share.difficulty,
        created_at: new Date().toISOString(),
        valid: share.valid, 
      };
    });

    for (const share of shares) {
      await ShareModel.insertShare(share);
    }

    res.status(201).json({
      message: `✅ Inserted ${shares.length} shares successfully`,
      shares,
    });
  } catch (error) {
    console.error('Error inserting shares:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};