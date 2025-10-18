import { client } from "../db/config";

export interface Payout {
  payout_id: string;
  miner_id: string;
  amount: number;
  tx_hash: string;
  paid_at: string;
}

export class PayoutModel {
  static async insert(payout: Payout) {
    await client.insert({
      table: 'payouts',
      values: [payout],
      format: 'JSONEachRow',
    });
  }

  static async findByMiner(miner_id: string): Promise<Payout[]> {
    const resultSet = await client.query({
      query: 'SELECT * FROM payouts WHERE miner_id = {miner_id:String} ORDER BY paid_at DESC',
      query_params: { miner_id },
      format: 'JSONEachRow',
    });

    return await resultSet.json<Payout>();
  }
}
