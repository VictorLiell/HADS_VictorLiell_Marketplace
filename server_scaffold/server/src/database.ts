import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Alternativamente:
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT || 5432),
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false as unknown as boolean } : undefined
});

export async function assertConnection() {
  const client = await pool.connect();
  try {
    await client.query('select 1');
    console.log('DB ok');
  } finally {
    client.release();
  }
}
