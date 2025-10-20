
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
    const {
      miner_id,
      wallet_address,
      connection_ip,
      last_seen: lastSeenFromBody 
    } = req.body;

    if (!miner_id) {
      return res.status(400).json({ error: 'miner_id is required' });
    }

    const userId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const newUser: User = {
      userId,
      miner_id,
      wallet_address: wallet_address || '',
      connection_ip: connection_ip || '',  
      created_at: createdAt,
      last_seen: lastSeenFromBody || createdAt,
    };

    await UserModel.insertModel(newUser);

    res.status(201).json({ message: 'User inserted successfully', userId: newUser.userId });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
