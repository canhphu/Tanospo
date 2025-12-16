import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load .env mặc định trước (nếu có)
dotenv.config();

// Sau đó override với file theo NODE_ENV
const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFiles = [
  `.env.${nodeEnv}.local`,
  `.env.${nodeEnv}`,
  '.env.local',
];

for (const file of envFiles) {
  const absPath = resolve(process.cwd(), file);
  if (existsSync(absPath)) {
    dotenv.config({ path: absPath, override: true });
    console.log(`[ENV] Loaded: ${file}`);
  }
}

const requireEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing env variable ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 5000),
  mongo: {
    uri: requireEnv(process.env.MONGO_URI, 'MONGO_URI'),
    dbName: process.env.MONGO_DB ?? 'tanospo',
  },
  googleMaps: {
    apiKey: requireEnv(process.env.GMAPS_KEY, 'GMAPS_KEY'),
  },
  aqiApiKey: requireEnv(process.env.AQI_KEY, 'AQI_KEY'),
  weatherApiKey: requireEnv(process.env.OPENWEATHER_KEY, 'OPENWEATHER_KEY'),
  jwtSecret: requireEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
};