import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config();

export const client = createClient({
  url: process.env.CLICKHOUSE_URL || "",
  username: process.env.CLICKHOUSE_USERNAME || "",
  password: process.env.CLICKHOUSE_PASSWORD || "",
  database: process.env.CLICKHOUSE_DATABASE || "",
  max_open_connections: 10,
  clickhouse_settings: {
    async_insert: 1,           
    wait_for_async_insert: 1,      
    async_insert_max_data_size: '3000000', 
    async_insert_busy_timeout_ms: 1000,   
  },
})