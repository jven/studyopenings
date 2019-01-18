import { EvaluateFlagsRequest, EvaluateFlagsResponse } from '../../protocol/actions';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { FlagEvaluator } from '../flagevaluator';

export class EvaluateFlagsAction
    implements Action<EvaluateFlagsRequest, EvaluateFlagsResponse> {
  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(): Promise<EvaluateFlagsResponse> {
    return Promise.resolve({
      evaluatedFlags: FlagEvaluator.evaluateAllFlags()
    });
  }
}
