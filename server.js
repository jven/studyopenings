const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const Config = require('./server/config.js').Config;

app.use(express.static(path.join(__dirname, 'client')));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('studyopenings is running!');
  
  console.log('Listening on ' + port + '.');
  const databasePath = process.env.DATABASE_PATH || Config.DATABASE_PATH;
  console.log('Database path: ' + databasePath);
});