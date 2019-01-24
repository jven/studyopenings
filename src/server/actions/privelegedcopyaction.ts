import { PrivelegedCopyRequest, PrivelegedCopyResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class PrivelegedCopyAction
  implements Action<PrivelegedCopyRequest, PrivelegedCopyResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: PrivelegedCopyRequest, user: string | null):
      Promise<PrivelegedCopyResponse> {
    return this.database_
        .copyRepertoireForPrivelegedUser(request.repertoireId, assert(user))
        .then(() => {
          return {};
        });
  }
}
