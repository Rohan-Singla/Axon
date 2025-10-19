import { client } from '../db/config';

export interface User {
  userId: string;
  miner_id: string;
  wallet_address: string;
  connection_ip: string;
  created_at: string;
  last_seen: string;
};


export class UserModel {

  static async getUserInfo(userId: string): Promise<User | null> {

    const res = await client.query({
      query: `select * from users where userId ={userId:String}
      limit 1`,
      query_params: { userId },
      format: 'JSONEachRow',
    });

    const rows = await res.json<User>();
    return rows.length ? rows[0]! : null;
  }
  static async insertModel(user_info: User) {

    await client.insert({
      table: "users",
      values: [user_info],
      format: 'JSONEachRow'
    })

  }

}

