import { SetPreferenceRequest, SetPreferenceResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class SetPreferenceAction
    implements Action<SetPreferenceRequest, SetPreferenceResponse> {
  private databaseWrapper_: DatabaseWrapper;

  constructor(databaseWrapper: DatabaseWrapper) {
    this.databaseWrapper_ = databaseWrapper;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: SetPreferenceRequest, user: string | null):
      Promise<SetPreferenceResponse> {
    return this.databaseWrapper_
        .setPreferenceForUser(request.preference, assert(user))
        .then(() => {
          return {};
        });
  }
}
