import { AuthManager } from '../authmanager';
import { DeleteRepertoireRequest, DeleteRepertoireResponse } from '../../../protocol/deleterepertoire';
import { MetadataJson, RepertoireJson } from '../../../protocol/protocol';
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
    return this.post_('/metadata', accessToken, {} /* body */);
  }

  loadRepertoire(repertoireId: string): Promise<RepertoireJson> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve(
          JSON.parse(localStorage.getItem('anonymous_repertoire') || '{}'));
    }
    return this.post_('/loadrepertoire', accessToken, {repertoireId});
  }

  saveRepertoire(repertoireId: string, repertoireJson: RepertoireJson): void {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      localStorage.setItem(
          'anonymous_repertoire', JSON.stringify(repertoireJson));
      return;
    }
    this.post_('/saverepertoire', accessToken, {repertoireId, repertoireJson});
  }

  createRepertoire(): Promise<void> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve();
    }
    return this.post_('/createrepertoire', accessToken, {} /* body */)
        .then(() => {});
  }

  deleteRepertoire(repertoireId: string): Promise<DeleteRepertoireResponse> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve({});
    }
    return this.post_('/deleterepertoire', accessToken, {repertoireId});
  }

  private post_<T>(
      endpoint: string,
      accessToken: string,
      body: Object): Promise<T> {
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
          return (res.json() as unknown) as T;
        })
        .catch(err => {
          this.showAuthError_();
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