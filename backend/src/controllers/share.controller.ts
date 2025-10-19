
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

export const createShare = async (req: Request, res: Response) => {
  try {
    const share: Share = req.body;

    if (!share.share_id || !share.miner_id || !share.job_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await ShareModel.insertShare(share);

    res.status(201).json({ message: 'Share inserted successfully' });
  } catch (error) {
    console.error('Error inserting share:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
