import { Request, Response } from "express";
import { PayoutModel } from "../models/payout.model";
import { UserModel } from "../models/user.model";

export const createPayout = async (req: Request, res: Response) => {
  try {
    const { wallet_address, amount } = req.body;

    if (!wallet_address || amount == null ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await UserModel.getByWallet(wallet_address);
    if (!user || !user.user_uuid) {
      return res.status(404).json({ error: "User not found or user_uuid missing" });
    }

    console.log(user);

    const paid_at = new Date().toISOString();

    await PayoutModel.insert({
      // miner_id: user.user_uuid, 
      wallet_address,
      amount,
      // tx_hash,
      paid_at
    });
    
    res.json({ message: "✅ Payout inserted successfully" });
  } catch (error) {
    console.error("Payout insert error:", error);
    res.status(500).json({ error: "Failed to insert payout" });
  }
};

export const getPayoutsByMiner = async (req: Request, res: Response) => {
  try {
    const payouts = await PayoutModel.findByUser(req.params.user_uuid as string);
    res.json(payouts);
  } catch (error) {
    console.error("Fetch payouts error:", error);
    res.status(500).json({ error: "Failed to fetch payouts" });
  }
};
