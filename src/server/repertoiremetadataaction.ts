import { DatabaseWrapper } from './databasewrapper';
import { Request, Response } from 'express';

export class RepertoireMetadataAction {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  post(request: Request, response: Response): void {
    this.database_
        .getRepertoiresForOwner(request.user.sub)
        .then(repertoireWithIds => repertoireWithIds.map(r => r.getMetadata()))
        .then(metadata => response.send(metadata))
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });
  }
}
