// db.ts
import 'dotenv/config';
import { Pool } from 'pg';

// Create a new pool instance using env variables
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
  ssl: {
    rejectUnauthorized: false // only use false for self-signed certs
  }
});

export default pool;
