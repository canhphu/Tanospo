import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envSample = resolve(process.cwd(), 'config/env.sample');
const envFile = resolve(process.cwd(), '.env');
const envDevFile = resolve(process.cwd(), '.env.development');

console.log('Setting up environment files...\n');

// Tạo .env từ env.sample nếu chưa có
if (!existsSync(envFile) && existsSync(envSample)) {
  copyFileSync(envSample, envFile);
  console.log('✅ Created .env from config/env.sample');
  console.log('⚠️  Please edit .env and fill in your actual values!\n');
} else if (existsSync(envFile)) {
  console.log('ℹ️  .env already exists, skipping...\n');
} else {
  console.log('❌ config/env.sample not found!\n');
}

// Tạo .env.development từ env.sample nếu chưa có
if (!existsSync(envDevFile) && existsSync(envSample)) {
  copyFileSync(envSample, envDevFile);
  console.log('✅ Created .env.development from config/env.sample');
  console.log('⚠️  Please edit .env.development and fill in your actual values!\n');
} else if (existsSync(envDevFile)) {
  console.log('ℹ️  .env.development already exists, skipping...\n');
}

console.log('Done! Remember to fill in your database credentials and API keys.');

