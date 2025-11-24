import app from './app';
import { env } from './config/env';

const server = app.listen(env.port, () => {
  console.log(`Tanospo API listening on port ${env.port}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

