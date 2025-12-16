import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env';

let client: MongoClient | null = null;
let db: Db | null = null;

export const getDb = async (): Promise<Db> => {
  if (db) return db;
  if (!env.mongo.uri) {
    throw new Error('Missing MONGO_URI');
  }
  client = new MongoClient(env.mongo.uri);
  await client.connect();
  db = client.db(env.mongo.dbName);
  return db;
};

export const closeDb = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};

