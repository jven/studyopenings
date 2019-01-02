const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const express = require('express');
const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const path = require('path');

import { Action } from './action';
import { Config } from './config';
import { CreateRepertoireAction } from './actions/createrepertoireaction';
import { DeleteRepertoireAction } from './actions/deleterepertoireaction';
import { DatabaseWrapper } from './databasewrapper';
import { LoadRepertoireAction } from './actions/loadrepertoireaction';
import { Middlewares } from './middlewares';
import { Request, Response } from 'express';
import { RepertoireMetadataAction } from './actions/repertoiremetadataaction';
import { UpdateRepertoireAction } from './actions/updaterepertoireaction';

const app = express();
const server = require('http').createServer(app);
const databaseWrapper = new DatabaseWrapper();
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
            res.sendFile(path.join(__dirname, '../client/main.html')));


// Register all of the server's actions.
registerAction(
    app,
    '/metadata',
    new RepertoireMetadataAction(databaseWrapper),
    ['read:repertoires']);
registerAction(
    app,
    '/loadrepertoire',
    new LoadRepertoireAction(databaseWrapper),
    ['read:repertoires']);
registerAction(
    app,
    '/updaterepertoire',
    new UpdateRepertoireAction(databaseWrapper),
    ['write:repertoires']);
registerAction(
    app,
    '/createrepertoire',
    new CreateRepertoireAction(databaseWrapper),
    ['write:repertoires']);
registerAction(
    app,
    '/deleterepertoire',
    new DeleteRepertoireAction(databaseWrapper),
    ['write:repertoires']);


function registerAction<REQUEST, RESPONSE>(
    app: any,
    path: string,
    action: Action<REQUEST, RESPONSE>,
    authScopes: string[]): void {
  app.post(
      path,
      checkJwt,
      jwtAuthz(authScopes),
      Middlewares.checkLoggedIn,
      Middlewares.checkHasBody,
      (req: Request, res: Response) => {
        action.do(req.body, req.user.sub)
            .then(response => {
              res.send(response);
            })
            .catch(err => {
              res.status(500).send(err);
            });
      });
}


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