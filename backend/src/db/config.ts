import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient({
  url: process.env.CLICKHOUSE_URL || "",
  username: process.env.CLICKHOUSE_USERNAME || "",
  password: process.env.CLICKHOUSE_PASSWORD || "",
  database: process.env.CLICKHOUSE_DATABASE || "",
})

// void (async () => {
//   const rows = await client.query({
//     query: 'SELECT 1',
//     format: 'JSONEachRow',
//   })
//   console.log('Result: ', await rows.json())
// })()
