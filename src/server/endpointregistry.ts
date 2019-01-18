import { Express, Request, Response } from 'express';
import * as jwt from 'express-jwt';
import { RequestHandler } from 'express-unless';
import * as jwksRsa from 'jwks-rsa';
import { assert } from '../util/assert';
import { Action } from './action';
import { Config } from './config';
import { Middlewares } from './middlewares';

const jwtAuthz = require('express-jwt-authz');

export class EndpointRegistry {
  private app_: Express;

  constructor(app: Express) {
    this.app_ = app;
  }

  registerLoggedInAction<REQUEST, RESPONSE>(
      path: string,
      action: Action<REQUEST, RESPONSE>,
      authScopes: string[]): EndpointRegistry {
    return this.registerAction_(
        path,
        action,
        [
          checkJwt,
          jwtAuthz(authScopes),
          Middlewares.checkLoggedIn
        ]);
  }

  registerAnonymousAction<REQUEST, RESPONSE>(
      path: string,
      action: Action<REQUEST, RESPONSE>): EndpointRegistry {
    return this.registerAction_(path, action, []);
  }

  private registerAction_<REQUEST, RESPONSE>(
      path: string,
      action: Action<REQUEST, RESPONSE>,
      middlewares: RequestHandler[]): EndpointRegistry {
    this.app_.post(
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
    return this;
  }
}

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
