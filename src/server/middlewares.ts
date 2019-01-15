import { Request, Response } from 'express';

export class Middlewares {
  static checkLoggedIn(request: Request, response: Response, next: () => void) {
    if (!request.user || !request.user.sub) {
      response
          .status(403)
          .send('You are not logged in.');
          return;
    }

    next();
  }

  static checkHasBody(request: Request, response: Response, next: () => void) {
    if (!request.body) {
      response
          .status(400)
          .send('Expecting JSON-encoded body.');
      return;
    }

    next();
  }
}
