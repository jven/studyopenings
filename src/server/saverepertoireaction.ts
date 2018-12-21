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
    if (!request.user || !request.user.sub) {
      response
          .status(403)
          .send('You are not logged in.');
          return;
    }
    if (!request.body
        || !request.body.repertoireId
        || !request.body.repertoireJson) {
      response
          .status(400)
          .send('Expecting JSON-encoded body, containing \'repertoireId\' and '
                + '\'repertoireJson\'.');
      return;
    }
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
