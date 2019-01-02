import { AuthManager } from '../authmanager';
import {
  CreateRepertoireRequest,
  CreateRepertoireResponse,
  DeleteRepertoireRequest,
  DeleteRepertoireResponse,
  LoadRepertoireRequest,
  LoadRepertoireResponse,
  MetadataRequest,
  MetadataResponse,
  UpdateRepertoireRequest,
  UpdateRepertoireResponse
} from '../../../protocol/actions';
import { Metadata, Repertoire } from '../../../protocol/storage';
import { Toasts } from './toasts';

export class ServerWrapper {
  private authManager_: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager_ = authManager;
  }

  getAllRepertoireMetadata(): Promise<Metadata[]> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve([{'id': 'fake', name: 'Untitled repertoire'}]);
    }
    return this.post_<MetadataRequest, MetadataResponse>(
        '/metadata',
        accessToken,
        {}).then(r => r.metadataList);
  }

  loadRepertoire(repertoireId: string): Promise<Repertoire> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve(
          JSON.parse(localStorage.getItem('anonymous_repertoire') || '{}'));
    }
    return this.post_<LoadRepertoireRequest, LoadRepertoireResponse>(
        '/loadrepertoire',
        accessToken,
        {repertoireId}).then(r => r.repertoireJson);
  }

  updateRepertoire(
      repertoireId: string,
      repertoireJson: Repertoire): Promise<void> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      localStorage.setItem(
          'anonymous_repertoire', JSON.stringify(repertoireJson));
      return Promise.resolve();
    }
    return this.post_<UpdateRepertoireRequest, UpdateRepertoireResponse>(
        '/updaterepertoire',
        accessToken,
        {repertoireId, repertoireJson}).then(() => {});
  }

  createRepertoire(): Promise<void> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve();
    }
    return this.post_<CreateRepertoireRequest, CreateRepertoireResponse>(
        '/createrepertoire',
        accessToken,
        {}).then(() => {});
  }

  deleteRepertoire(repertoireId: string): Promise<void> {
    const accessToken = this.authManager_.getAccessToken();
    if (!accessToken) {
      return Promise.resolve();
    }
    return this.post_<DeleteRepertoireRequest, DeleteRepertoireResponse>(
        '/deleterepertoire',
        accessToken,
        {repertoireId}).then(() => {});
  }

  private post_<REQUEST, RESPONSE>(
      endpoint: string,
      accessToken: string,
      body: REQUEST): Promise<RESPONSE> {
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
          return (res.json() as unknown) as RESPONSE;
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