import { LoadRepertoireRequest, LoadRepertoireResponse } from '../../protocol/actions';
import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';

export class LoadRepertoireAction
    implements Action<LoadRepertoireRequest, LoadRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: LoadRepertoireRequest, user: string):
      Promise<LoadRepertoireResponse> {
    return this.database_
        .getRepertoireForOwner(request.repertoireId, user)
        .then(repertoire => { return {repertoire}; });
  }
}
