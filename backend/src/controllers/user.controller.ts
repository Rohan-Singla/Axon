import { Request, Response } from "express";
import { UserModel, User } from "../models/user.model";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { user_uuid } = req.params;

    if (!user_uuid) {
      return res.status(400).json({ error: "user_uuid is required" });
    }

    const user = await UserModel.getUserInfo(user_uuid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { miner_id, wallet_address, connection_ip, last_seen } = req.body;

    if (!miner_id || !wallet_address) {
      return res.status(400).json({ error: "miner_id and wallet_address are required" });
    }

    const existingUser = await UserModel.getByWallet(wallet_address);
    if (existingUser) {
      return res.status(409).json({
        message: "User with this wallet already exists",
        user_uuid: existingUser.user_uuid,
      });
    }

    const createdAt = new Date().toISOString();

    const newUser: User = {
      miner_id,
      wallet_address,
      connection_ip: connection_ip || "",
      created_at: createdAt,
      last_seen: last_seen || createdAt,
    };

    await UserModel.insertModel(newUser);

    res.status(201).json({ message: "User inserted successfully" });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByWallet = async (req: Request, res: Response) => {
  try {
    const { wallet_address } = req.params;

    if (!wallet_address) {
      return res.status(400).json({ error: "wallet_address is required" });
    }

    const user = await UserModel.getByWallet(wallet_address);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by wallet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

