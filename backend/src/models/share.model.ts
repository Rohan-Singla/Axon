import { client } from "../db/config";

export interface Share {
  share_uuid?: string;
  miner_id: string;
  job_id: string;
  difficulty: string;
  valid: string;
  submitted_at?: string; 
}

export class ShareModel {
  static async insertMany(shares: Share[]) {
    if (!shares.length) return;

    await client.insert({
      table: "shares",
      values: shares,
      format: "JSONEachRow",
    });
  }

  static async getById(share_uuid: string): Promise<Share | null> {
    const result = await client.query({
      query: "SELECT * FROM shares WHERE share_uuid = {share_uuid:UUID} LIMIT 1",
      query_params: { share_uuid },
      format: "JSONEachRow",
    });

    const rows = await result.json<Share>();
    return rows.length ? rows[0]! : null;
  }
}
