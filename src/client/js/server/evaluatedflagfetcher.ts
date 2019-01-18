import { EvaluateFlagsResponse } from '../../../protocol/actions';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { Toasts } from '../common/toasts';

export class EvaluatedFlagFetcher {
  static fetchEvaluatedFlags(): Promise<EvaluatedFlags> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return fetch('/flags', options)
        .then(res => (res.json() as unknown) as EvaluateFlagsResponse)
        .then(evaluatedFlagsResponse => evaluatedFlagsResponse.evaluatedFlags)
        .catch(err => {
          EvaluatedFlagFetcher.showError_();
          throw err;
        });
  }

  private static showError_(): void {
    Toasts.error(
      'Something went wrong.',
      'There was a problem reaching the server. Please refresh the page and '
          + 'try again.');
  }
}
