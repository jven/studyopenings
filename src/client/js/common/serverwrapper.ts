import { AuthManager } from '../authmanager';
import { MetadataJson } from '../../../protocol/protocol';
import { Toasts } from './toasts';

export class ServerWrapper {
  private authManager_: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager_ = authManager;
  }

  getAllRepertoireMetadata(): Promise<MetadataJson[]> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve([{'id': 'fake', name: 'Untitled repertoire'}]);
    }
    return this.post_('/metadata', accessToken, {} /* body */)
        .then(res => res.json());
  }

  loadRepertoire(repertoireId: string): Promise<Object> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve(
          JSON.parse(localStorage.getItem('anonymous_repertoire') || '{}'));
    }
    return this.post_('/loadrepertoire', accessToken, {repertoireId})
        .then(res => res.json());
  }

  saveRepertoire(repertoireJson: Object): void {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      localStorage.setItem(
          'anonymous_repertoire', JSON.stringify(repertoireJson));
      return;
    }
    this.post_('/saverepertoire', accessToken, {repertoireJson});
  }

  private post_(
      endpoint: string,
      accessToken: string,
      body: Object): Promise<Response> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(body)
    };
    return fetch(endpoint, options)
        .then(res => {
          if (res.status != 200) {
            this.showAuthError_();
            throw new Error('Server returned status ' + res.status + '.');
          }
          return res;
        })
        .catch(err => {
          this.showAuthError_();
          console.error('Error reaching server:');
          console.error(err);
          throw err;
        });
  }

  private showAuthError_(): void {
    Toasts.error(
        'Something went wrong.',
        'There was a problem reaching the server. Please refresh the page and '
            + 'try again.');
  }
}