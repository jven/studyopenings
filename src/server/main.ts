const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const express = require('express');
const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const path = require('path');

import { Request, Response } from 'express';

import { Config } from './config';
import { DatabaseWrapper } from './databasewrapper';
import { LoadRepertoireAction } from './loadrepertoireaction';
import { RepertoireMetadataAction } from './repertoiremetadataaction';
import { SaveRepertoireAction } from './saverepertoireaction';

const app = express();
const server = require('http').createServer(app);

const databaseWrapper = new DatabaseWrapper();
const loadRepertoireAction = new LoadRepertoireAction(databaseWrapper);
const repertoireMetadataAction = new RepertoireMetadataAction(databaseWrapper);
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
    .use(express.static(path.join(__dirname, '../client')))
    .use(bodyParser.json({limit: '50mb'}))
    .use(cors())
    .get(
        '/',
        (req: Request, res: Response) =>
            res.sendFile(path.join(__dirname, '../client/main.html')))
    .post(
        '/loadrepertoire',
        checkJwt,
        jwtAuthz(['read:repertoires']),
        loadRepertoireAction.post.bind(loadRepertoireAction))
    .post(
        '/saverepertoire',
        checkJwt,
        jwtAuthz(['write:repertoires']),
        saveRepertoireAction.post.bind(saveRepertoireAction))
    .post(
        '/metadata',
        checkJwt,
        jwtAuthz(['read:repertoires']),
        repertoireMetadataAction.post.bind(repertoireMetadataAction));

function main() {
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
}

main();