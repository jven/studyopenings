import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';
import { UpdateRepertoireRequest, UpdateRepertoireResponse } from '../../protocol/actions';

export class UpdateRepertoireAction implements
    Action<UpdateRepertoireRequest, UpdateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: UpdateRepertoireRequest, user: string):
      Promise<UpdateRepertoireResponse> {
    return this.database_
        .updateRepertoire(request.repertoireId, request.repertoireJson, user)
        .then(() => { return {}; });

  }
}
