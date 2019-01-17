const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const path = require('path');

import { Request, Response } from 'express';
import { assert } from '../util/assert';
import { Action } from './action';
import { CreateRepertoireAction } from './actions/createrepertoireaction';
import { DeleteRepertoireAction } from './actions/deleterepertoireaction';
import { LoadRepertoireAction } from './actions/loadrepertoireaction';
import { LogImpressionsAction } from './actions/logimpressionsaction';
import { RepertoireMetadataAction } from './actions/repertoiremetadataaction';
import { UpdateRepertoireAction } from './actions/updaterepertoireaction';
import { Config } from './config';
import { DatabaseWrapper } from './databasewrapper';
import { FlagEvaluator } from './flagevaluator';
import { Middlewares } from './middlewares';

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
    .use(bodyParser.json({limit: '1mb'}))
    .use(cors())
    .get(
        '/',
        (req: Request, res: Response) =>
            res.sendFile(path.join(__dirname, '../client/main.html')))
    .get(
        '/about',
        (req: Request, res: Response) =>
            res.sendFile(path.join(__dirname, '../client/about.html')))
    .get(
        '/flags',
        (req: Request, res: Response) => {
          res.send(FlagEvaluator.evaluateAllFlags());
        });


// Register all of the server's actions.
registerLoggedInAction(
    app,
    '/metadata',
    new RepertoireMetadataAction(databaseWrapper),
    ['read:repertoires']);
registerLoggedInAction(
    app,
    '/loadrepertoire',
    new LoadRepertoireAction(databaseWrapper),
    ['read:repertoires']);
registerLoggedInAction(
    app,
    '/updaterepertoire',
    new UpdateRepertoireAction(databaseWrapper),
    ['write:repertoires']);
registerLoggedInAction(
    app,
    '/createrepertoire',
    new CreateRepertoireAction(databaseWrapper),
    ['write:repertoires']);
registerLoggedInAction(
    app,
    '/deleterepertoire',
    new DeleteRepertoireAction(databaseWrapper),
    ['write:repertoires']);
registerAnonymousAction(
    app,
    '/impressions',
    new LogImpressionsAction(databaseWrapper));


function registerLoggedInAction<REQUEST, RESPONSE>(
    app: any,
    path: string,
    action: Action<REQUEST, RESPONSE>,
    authScopes: string[]): void {
  registerAction_(
      app,
      path,
      action,
      [
        checkJwt,
        jwtAuthz(authScopes),
        Middlewares.checkLoggedIn,
      ]);
}


function registerAnonymousAction<REQUEST, RESPONSE>(
    app: any,
    path: string,
    action: Action<REQUEST, RESPONSE>): void {
  registerAction_(
      app,
      path,
      action,
      []);
}


function registerAction_<REQUEST, RESPONSE>(
    app: any,
    path: string,
    action: Action<REQUEST, RESPONSE>,
    middlewares: any[]): void {
  app.post(
      path,
      middlewares,
      Middlewares.checkHasBody,
      (req: Request, res: Response) => {
          const body = assert(req.body);
          const user = (req.user && req.user.sub) || null;
          action.checkRequest(body, user)
              .then(checkRequestResult => {
                if (!checkRequestResult.success) {
                  res.status(400).send(checkRequestResult.failureMessage || '');
                  return;
                }
                return action.do(body, user)
                    .then(response => {
                      res.send(response);
                    });
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
