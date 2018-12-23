import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';
import { SaveRepertoireRequest, SaveRepertoireResponse } from '../../protocol/actions';

export class SaveRepertoireAction implements
    Action<SaveRepertoireRequest, SaveRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: SaveRepertoireRequest, user: string):
      Promise<SaveRepertoireResponse> {
    return this.database_
        .updateRepertoire(request.repertoireId, request.repertoireJson, user)
        .then(() => { return {}; });

  }
}
