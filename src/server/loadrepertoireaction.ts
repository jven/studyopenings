import { DatabaseWrapper } from './databasewrapper';
import { Request, Response } from 'express';

export class LoadRepertoireAction {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  post(request: Request, response: Response) {
    if (!request.user || !request.user.sub) {
      response
          .status(403)
          .send('You are not logged in.');
          return;
    }
    if (!request.body || !request.body.repertoireId) {
      response
          .status(400)
          .send('Expecting JSON-encoded body, containing \'repertoireId\'.');
      return;
    }
    this.database_
        .getRepertoireForOwner(request.body.repertoireId, request.user.sub)
        .then(repertoire => response.send(repertoire.serializeForClient()))
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });
  }
}
