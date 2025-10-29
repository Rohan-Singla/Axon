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

  static async getMinerContribution(miner_id: string, n: number): Promise<number> {

  const result = await client.query({
    query: `
      SELECT miner_id, difficulty
      FROM shares
      ORDER BY submitted_at DESC
      LIMIT {n:UInt32}
    `,
    query_params: { n },
    format: "JSONEachRow",
  });

  const rows = (await result.json()) as { miner_id: string; difficulty: string }[];

  if (!rows.length) return 0;


  const totalDifficulty = rows.reduce((sum, r) => sum + Number(r.difficulty), 0);
  const minerDifficulty = rows
    .filter((r) => r.miner_id === miner_id)
    .reduce((sum, r) => sum + Number(r.difficulty), 0);


  const contribution = (minerDifficulty / totalDifficulty) * 100;

  return Number(contribution.toFixed(2)); 
}

}