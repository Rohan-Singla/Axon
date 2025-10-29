import { Request, Response } from "express";
import { ShareModel, Share } from "../models/share.model";

export const getShareById = async (req: Request, res: Response) => {
  try {
    const { share_uuid } = req.params;

    if (!share_uuid) {
      return res.status(400).json({ error: "share_uuid is required" });
    }

    const share = await ShareModel.getById(share_uuid);

    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }

    res.status(200).json(share);
  } catch (error) {
    console.error("Error fetching share:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createShares = async (req: Request, res: Response) => {
  try {
    let sharesInput = req.body;

    if (!Array.isArray(sharesInput)) {
      sharesInput = [sharesInput];
    }

    if (sharesInput.length === 0) {
      return res.status(400).json({ error: "Shares must be a non-empty array or object" });
    }

    const shares: Share[] = sharesInput.map((share: any) => {
      if (!share.miner_id || !share.job_id || !share.difficulty || !share.valid) {
        throw new Error("Missing required fields in one of the shares");
      }
      return {
        miner_id: share.miner_id,
        job_id: share.job_id,
        difficulty: share.difficulty,
        valid: share.valid,
        submitted_at: new Date().toISOString(),
      };
    });

    await ShareModel.insertMany(shares);

    res.status(201).json({
      message: `✅ Inserted ${shares.length} share${shares.length > 1 ? "s" : ""} successfully`,
      shares,
    });
  } catch (error) {
    console.error("Error inserting shares:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 🧮 Get miner contribution percentage for last 10,000 shares
 * @route GET /shares/contribution/:miner_id
 */
export const getMinerContribution = async (req: Request, res: Response) => {
  try {
    const { miner_id } = req.params;

    if (!miner_id) {
      return res.status(400).json({ error: "miner_id is required" });
    }

    const n = 10000;
    const contribution = await ShareModel.getMinerContribution(miner_id, n);

    res.status(200).json({
      miner_id,
      last_n: n,
      contribution_percentage: contribution,
    });
  } catch (error) {
    console.error("Error calculating miner contribution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};