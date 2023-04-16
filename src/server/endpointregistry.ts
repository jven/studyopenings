import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Express, Request, Response, static as exposeStatic } from 'express';
import * as jwt from 'express-jwt';
import jwtAuthz = require('express-jwt-authz');
// @ts-ignore
import { RequestHandler } from 'express-unless';
import * as jwksRsa from 'jwks-rsa';
import * as path from 'path';
import { assert } from '../util/assert';
import { Action } from './action';
import { isPrivelegedUser } from './privelegedusers';

export class EndpointRegistry {
  private app_: Express;

  constructor(app: Express, maximumRequestSize: string) {
    this.app_ = app;

    app
        .use(bodyParser.json({limit: maximumRequestSize}))
        .use(cors());
  }

  registerStaticFolder(relativeFilePath: string): EndpointRegistry {
    this.app_.use(exposeStatic(path.join(__dirname, relativeFilePath)));
    return this;
  }

  registerStaticFile(
      endpoint: string,
      relativeFilePath: string): EndpointRegistry {
    this.app_.get(
        endpoint,
        (req: Request, res: Response) => {
          res.sendFile(path.join(__dirname, relativeFilePath));
        });
    return this;
  }

  registerLoggedInAction<REQUEST, RESPONSE>(
      endpoint: string,
      action: Action<REQUEST, RESPONSE>,
      authScopes: string[]): EndpointRegistry {
    return this.registerAction_(
        endpoint,
        action,
        [
          checkJwt,
          jwtAuthz(authScopes),
          EndpointRegistry.checkLoggedIn_
        ]);
  }

  registerPrivelegedAction<REQUEST, RESPONSE>(
      endpoint: string,
      action: Action<REQUEST, RESPONSE>,
      authScopes: string[]): EndpointRegistry {
    return this.registerAction_(
        endpoint,
        action,
        [
          checkJwt,
          jwtAuthz(authScopes),
          EndpointRegistry.checkLoggedIn_,
          EndpointRegistry.checkIsPrivelegedUser_
        ]);
  }

  registerAnonymousAction<REQUEST, RESPONSE>(
      endpoint: string,
      action: Action<REQUEST, RESPONSE>): EndpointRegistry {
    return this.registerAction_(endpoint, action, []);
  }

  private registerAction_<REQUEST, RESPONSE>(
      endpoint: string,
      action: Action<REQUEST, RESPONSE>,
      requestHandlers: RequestHandler[]): EndpointRegistry {
    this.app_.post(
        endpoint,
        requestHandlers,
        EndpointRegistry.checkHasBody_,
        (req: Request, res: Response) => {
          const body = assert(req.body);
          const user = ((req as any).user && (req as any).user.sub) || null;
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
    return this;
  }

  private static checkLoggedIn_(
      request: Request, response: Response, next: () => void): void {
    if (!(request as any).user || !(request as any).user.sub) {
      response
          .status(403)
          .send('You are not logged in.');
      return;
    }

    next();
  }

  private static checkHasBody_(
      request: Request, response: Response, next: () => void): void {
    if (!request.body) {
      response
          .status(400)
          .send('Expecting JSON-encoded body.');
      return;
    }

    next();
  }

  private static checkIsPrivelegedUser_(
      request: Request, response: Response, next: () => void): void {
    if (!isPrivelegedUser((request as any).user.sub)) {
      response
          .status(403)
          .send('Only priveleged users can do this.');
      return;
    }

    next();
  }
}

const AUTH0_DOMAIN = 'studyopenings.auth0.com';
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: 'studyopenings-api',
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});
