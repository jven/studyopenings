import { DeleteRepertoireRequest, DeleteRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class DeleteRepertoireAction
    implements Action<DeleteRepertoireRequest, DeleteRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: DeleteRepertoireRequest, user: string | null):
      Promise<DeleteRepertoireResponse> {
    return this.database_
        .deleteRepertoire(request.repertoireId, assert(user))
        .then(() => { return {}; });
  }
}
