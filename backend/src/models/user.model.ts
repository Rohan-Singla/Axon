import { client } from "../db/config";

export interface User {
  user_uuid?: string; 
  miner_id: string;
  wallet_address: string;
  connection_ip: string;
  created_at?: string;
  last_seen?: string;
}

export class UserModel {
  static async getByWallet(wallet_address: string): Promise<User | null> {
    const res = await client.query({
      query: `SELECT * FROM users WHERE wallet_address = {wallet_address:String} LIMIT 1`,
      query_params: { wallet_address },
      format: "JSONEachRow",
    });

    const rows = await res.json<User>();
    return rows.length ? rows[0]! : null;
  }

  static async getUserInfo(user_uuid: string): Promise<User | null> {
    const res = await client.query({
      query: `SELECT * FROM users WHERE user_uuid = {user_uuid:UUID} LIMIT 1`,
      query_params: { user_uuid },
      format: "JSONEachRow",
    });

    const rows = await res.json<User>();
    return rows.length ? rows[0]! : null;
  }

  static async insertModel(user_info: User) {
    await client.insert({
      table: "users",
      values: [user_info],
      format: "JSONEachRow",
    });
  }
}
