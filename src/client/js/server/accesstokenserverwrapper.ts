import {
  CreateRepertoireRequest,
  CreateRepertoireResponse,
  DeleteRepertoireRequest,
  DeleteRepertoireResponse,
  GetPreferenceRequest,
  GetPreferenceResponse,
  LoadRepertoireRequest,
  LoadRepertoireResponse,
  MetadataRequest,
  MetadataResponse,
  PrivelegedCopyRequest,
  PrivelegedCopyResponse,
  RecordStatisticsRequest,
  RecordStatisticsResponse,
  SetPreferenceRequest,
  SetPreferenceResponse,
  UpdateRepertoireRequest,
  UpdateRepertoireResponse
} from '../../../protocol/actions';
import { Preference } from '../../../protocol/preference/preference';
import { Statistic } from '../../../protocol/statistic/statistic';
import { Metadata, Repertoire } from '../../../protocol/storage';
import { Toasts } from '../common/toasts';
import { ServerWrapper } from './serverwrapper';

export class AccessTokenServerWrapper implements ServerWrapper {
  private accessToken_: string;

  constructor(accessToken: string) {
    this.accessToken_ = accessToken;
  }

  getAllRepertoireMetadata(): Promise<Metadata[]> {
    return this.post_<MetadataRequest, MetadataResponse>(
        '/metadata', {}).then(r => r.metadataList);
  }

  loadRepertoire(repertoireId: string): Promise<Repertoire> {
    return this.post_<LoadRepertoireRequest, LoadRepertoireResponse>(
        '/loadrepertoire', {repertoireId}).then(r => r.repertoire);
  }

  updateRepertoire(
      repertoireId: string, repertoire: Repertoire): Promise<void> {
    return this.post_<UpdateRepertoireRequest, UpdateRepertoireResponse>(
        '/updaterepertoire', {repertoireId, repertoire}).then(() => {});
  }

  createRepertoire(): Promise<string> {
    return this.post_<CreateRepertoireRequest, CreateRepertoireResponse>(
        '/createrepertoire', {}).then(r => r.newRepertoireId);
  }

  deleteRepertoire(repertoireId: string): Promise<void> {
    return this.post_<DeleteRepertoireRequest, DeleteRepertoireResponse>(
        '/deleterepertoire', {repertoireId}).then(() => {});
  }

  setPreference(preference: Preference): Promise<void> {
    return this.post_<SetPreferenceRequest, SetPreferenceResponse>(
        '/setpreference', {preference}).then(() => {});
  }

  getPreference(): Promise<Preference> {
    return this.post_<GetPreferenceRequest, GetPreferenceResponse>(
        '/getpreference', {}).then(r => r.preference);
  }

  recordStatistics(statisticList: Statistic[]): Promise<void> {
    return this.post_<RecordStatisticsRequest, RecordStatisticsResponse>(
        '/recordstatistics', {statisticList})
        .then(() => {});
  }

  copyRepertoireAsPrivelegedUser(repertoireId: string): Promise<void> {
    return this.post_<PrivelegedCopyRequest, PrivelegedCopyResponse>(
        '/privelegedcopy', {repertoireId})
        .then(() => {});
  }

  private post_<REQUEST, RESPONSE>(
      endpoint: string, body: REQUEST): Promise<RESPONSE> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken_
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
