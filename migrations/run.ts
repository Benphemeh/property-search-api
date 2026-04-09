import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as path from 'path';
import { pool } from '../src/config/database.config';

async function runMigrations(): Promise<void> {
  console.log('Running migrations...');
  const sql = fs.readFileSync(path.join(__dirname, '001_setup.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migrations complete');
  await pool.end();
}

runMigrations().catch(console.error);
