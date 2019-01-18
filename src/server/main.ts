import * as dotenv from 'dotenv';
import { Server } from './server';

(() => {
  dotenv.config();
  const port = process.env.PORT || '5000';
  const databasePath = process.env.DATABASE_PATH;
  if (!databasePath) {
    throw new Error('Database path not provided!');
  }

  new Server().run(port, databasePath);
})();
