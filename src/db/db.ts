import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import config from '../config';

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DATABASE_NAME,
});

const db = drizzle(pool);

export default db;
