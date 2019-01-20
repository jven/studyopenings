import { SetPreferenceRequest, SetPreferenceResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';
import { FlagEvaluator } from '../flagevaluator';
import { FlagName } from '../../flag/flags';

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
    const flags = FlagEvaluator.evaluateAllFlags();
    if (flags[FlagName.ENABLE_STORING_PREFERENCES]) {
      return Promise.resolve({});
    }
    return this.databaseWrapper_
        .setPreferenceForUser(request.preference, assert(user))
        .then(() => {
          return {};
        });
  }
}
