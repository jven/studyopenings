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
import { CreateRepertoireAction } from './createrepertoireaction';
import { DeleteRepertoireAction } from './deleterepertoireaction';
import { DatabaseWrapper } from './databasewrapper';
import { LoadRepertoireAction } from './loadrepertoireaction';
import { Middlewares } from './middlewares';
import { RepertoireMetadataAction } from './repertoiremetadataaction';
import { SaveRepertoireAction } from './saverepertoireaction';

const app = express();
const server = require('http').createServer(app);

const databaseWrapper = new DatabaseWrapper();
const loadRepertoireAction = new LoadRepertoireAction(databaseWrapper);
const repertoireMetadataAction = new RepertoireMetadataAction(databaseWrapper);
const saveRepertoireAction = new SaveRepertoireAction(databaseWrapper);
const createRepertoireAction = new CreateRepertoireAction(databaseWrapper);
const deleteRepertoireAction = new DeleteRepertoireAction(databaseWrapper);

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
        Middlewares.checkLoggedIn,
        Middlewares.checkHasBody,
        loadRepertoireAction.post.bind(loadRepertoireAction))
    .post(
        '/saverepertoire',
        checkJwt,
        jwtAuthz(['write:repertoires']),
        Middlewares.checkLoggedIn,
        Middlewares.checkHasBody,
        saveRepertoireAction.post.bind(saveRepertoireAction))
    .post(
        '/createrepertoire',
        checkJwt,
        jwtAuthz(['write:repertoires']),
        Middlewares.checkLoggedIn,
        Middlewares.checkHasBody,
        createRepertoireAction.post.bind(createRepertoireAction))
    .post(
        '/deleterepertoire',
        checkJwt,
        jwtAuthz(['write:repertoires']),
        Middlewares.checkLoggedIn,
        Middlewares.checkHasBody,
        deleteRepertoireAction.post.bind(deleteRepertoireAction))
    .post(
        '/metadata',
        checkJwt,
        jwtAuthz(['read:repertoires']),
        Middlewares.checkLoggedIn,
        Middlewares.checkHasBody,
        repertoireMetadataAction.post.bind(repertoireMetadataAction));

function main() {
  const port = process.env.PORT || 5000;
  const databasePath = process.env.DATABASE_PATH;
  if (!databasePath) {
    throw new Error('Database path not provided!');
  }
  server.listen(port, () => {
    console.log('studyopenings is running!');
    
    console.log('Listening on ' + port + '.');
    databaseWrapper.connect(databasePath);
  });
}

main();