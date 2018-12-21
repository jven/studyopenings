import { Color } from '../protocol/color';
import { DatabaseWrapper } from './databasewrapper';
import { Repertoire } from './repertoire';
import { Request, Response } from 'express';

export class CreateRepertoireAction {
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
    const repertoire = new Repertoire(
        {color: Color.WHITE, root: null},
        request.user.sub);
    this.database_
        .createNewRepertoire(repertoire)
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
