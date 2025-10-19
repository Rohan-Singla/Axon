
import { client } from '../db/config';

export interface Share {
  share_id: string;
  miner_id: string;
  job_id: string;
  difficulty: string;
  valid: string;
  submitted_at?: string; // optional since ClickHouse auto-generates it
}

export class ShareModel {
  static async insertShare(share: Share) {
    await client.insert({
      table: 'shares',
      values: [share],
      format: 'JSONEachRow',
    });
  }

  static async getShareById(share_id: string): Promise<Share | null> {
    const result = await client.query({
      query: 'SELECT * FROM shares WHERE share_id = {share_id:String} LIMIT 1',
      query_params: { share_id },
      format: 'JSONEachRow',
    });

    const rows = await result.json<Share>();
    return rows.length ? rows[0]! : null;
  }

}
