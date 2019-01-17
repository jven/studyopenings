import { LoadRepertoireRequest, LoadRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class LoadRepertoireAction
    implements Action<LoadRepertoireRequest, LoadRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: LoadRepertoireRequest, user: string | null):
      Promise<LoadRepertoireResponse> {
    return this.database_
        .getRepertoireForOwner(request.repertoireId, assert(user))
        .then(repertoire => { return {repertoire}; });
  }
}
