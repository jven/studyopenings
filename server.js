const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const Config = require('./server/config.js').Config;
const DatabaseWrapper = require('./server/databasewrapper.js').DatabaseWrapper;
const LoadRepertoireAction = require('./server/loadrepertoireaction.js').LoadRepertoireAction;
const SaveRepertoireAction = require('./server/saverepertoireaction.js').SaveRepertoireAction;

const databaseWrapper = new DatabaseWrapper();
const loadRepertoireAction = new LoadRepertoireAction(databaseWrapper);
const saveRepertoireAction = new SaveRepertoireAction(databaseWrapper);

app
    .use(express.static(path.join(__dirname, 'client')))
    .use(bodyParser.json())
    .post(
        '/loadrepertoire',
        loadRepertoireAction.post.bind(loadRepertoireAction))
    .post(
        '/saverepertoire',
        saveRepertoireAction.post.bind(saveRepertoireAction));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('studyopenings is running!');
  
  console.log('Listening on ' + port + '.');
  const databasePath = process.env.DATABASE_PATH || Config.DATABASE_PATH;
  databaseWrapper.connect(databasePath);
});