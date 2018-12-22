import { DatabaseWrapper } from './databasewrapper';
import { Repertoire } from './repertoire';
import { RepertoireWithId } from './repertoirewithid';
import { Request, Response } from 'express';

export class SaveRepertoireAction {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  post(request: Request, response: Response): void {
    const repertoireWithId = new RepertoireWithId(
        new Repertoire(request.body.repertoireJson, request.user.sub),
        request.body.repertoireId);
    this.database_
        .updateRepertoire(repertoireWithId)
        .then(() => {
          response.send({});
        })
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });

  }
}
