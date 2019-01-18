import { Server } from './server';

require('dotenv').config();


function main() {
  const port = process.env.PORT || '5000';
  const databasePath = process.env.DATABASE_PATH;
  if (!databasePath) {
    throw new Error('Database path not provided!');
  }

  new Server().run(port, databasePath);
}


main();
