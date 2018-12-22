import { DatabaseWrapper } from './databasewrapper';
import { Request, Response } from 'express';

export class LoadRepertoireAction {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  post(request: Request, response: Response) {
    this.database_
        .getRepertoireForOwner(request.body.repertoireId, request.user.sub)
        .then(repertoireWithId => response.send(
            repertoireWithId.serializeForClient()))
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });
  }
}
