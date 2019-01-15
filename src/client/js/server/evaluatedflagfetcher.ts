import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { Toasts } from '../common/toasts';

export class EvaluatedFlagFetcher {
  static fetchEvaluatedFlags(): Promise<EvaluatedFlags> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return fetch('/flags', options)
        .then(res => res.json())
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