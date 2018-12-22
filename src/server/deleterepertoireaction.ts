import { DatabaseWrapper } from './databasewrapper';
import { Request, Response } from 'express';

export class DeleteRepertoireAction {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  post(request: Request, response: Response): void {
    this.database_
        .deleteRepertoire(request.body.repertoireId, request.user.sub)
        .then(() => response.send({}))
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });
  }
}
