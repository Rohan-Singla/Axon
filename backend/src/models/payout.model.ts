import { client } from "../db/config";

export interface Payout {
  payout_uuid?: string; 
  miner_id: string;
  amount: number;
  tx_hash: string;
  paid_at?: string; 
}

export class PayoutModel {
  static async insert(payout: Payout) {
    await client.insert({
      table: "payouts",
      values: [payout],
      format: "JSONEachRow",
    });
  }

  static async findByUser(user_uuid: string): Promise<Payout[]> {
    const resultSet = await client.query({
      query: "SELECT * FROM payouts WHERE user_uuid = {user_uuid:UUID} ORDER BY paid_at DESC",
      query_params: { user_uuid },
      format: "JSONEachRow",
    });

    return await resultSet.json<Payout>();
  }
}
