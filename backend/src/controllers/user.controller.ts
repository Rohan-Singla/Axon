
import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { User } from '../models/user.model';

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await UserModel.getUserInfo(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user_info: User = req.body;

    if (!user_info.userId || !user_info.miner_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await UserModel.insertModel(user_info);

    res.status(201).json({ message: 'User inserted successfully' });
  } catch (error) {
    console.error('Error inserting user:', error);
  }
}
