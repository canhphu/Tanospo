import { readFileSync } from 'fs';
import { resolve } from 'path';
import { pool } from '../src/infrastructure/db';

const run = async () => {
  const file = readFileSync(resolve(__dirname, '../migrations/001_init.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(file);
    await client.query('COMMIT');
    console.log('Migration completed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();

