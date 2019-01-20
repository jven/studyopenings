import { GetPreferenceRequest, GetPreferenceResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class GetPreferenceAction
    implements Action<GetPreferenceRequest, GetPreferenceResponse> {
  private databaseWrapper_: DatabaseWrapper;

  constructor(databaseWrapper: DatabaseWrapper) {
    this.databaseWrapper_ = databaseWrapper;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: GetPreferenceRequest, user: string | null):
      Promise<GetPreferenceResponse> {
    return this.databaseWrapper_.getPreferenceForUser(assert(user))
        .then(preference => {
          return {preference};
        });
  }
}
