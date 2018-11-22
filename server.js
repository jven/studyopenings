const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://' + Config.AUTH0_DOMAIN + '/.well-known/jwks.json'
  }),
  audience: Config.AUTH0_AUDIENCE,
  issuer: 'https://' + Config.AUTH0_DOMAIN + '/',
  algorithms: ['RS256']
});

app
    .use(express.static(path.join(__dirname, 'client')))
    .use(bodyParser.json())
    .use(cors())
    .post(
        '/loadrepertoire',
        checkJwt,
        jwtAuthz(['read:repertoires']),
        loadRepertoireAction.post.bind(loadRepertoireAction))
    .post(
        '/saverepertoire',
        checkJwt,
        jwtAuthz(['write:repertoires']),
        saveRepertoireAction.post.bind(saveRepertoireAction));

const port = process.env.PORT || 5000;
const databasePath = process.env.DATABASE_PATH;
if (!databasePath) {
  console.error('Database path not provided!');
  return;
}
server.listen(port, () => {
  console.log('studyopenings is running!');
  
  console.log('Listening on ' + port + '.');
  databaseWrapper.connect(databasePath);
});