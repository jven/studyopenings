import { Preference } from '../../../protocol/preference/preference';
import { CumulatedStatistic } from '../../../protocol/statistic/cumulatedstatistic';
import { Statistic } from '../../../protocol/statistic/statistic';
import { Metadata, Repertoire } from '../../../protocol/storage';
import { ServerWrapper } from './serverwrapper';

export class DelegatingServerWrapper implements ServerWrapper {
  private delegate_: ServerWrapper;

  constructor(delegate: ServerWrapper) {
    this.delegate_ = delegate;
  }

  setDelegate(delegate: ServerWrapper) {
    this.delegate_ = delegate;
  }

  getAllRepertoireMetadata(): Promise<Metadata[]> {
    return this.delegate_.getAllRepertoireMetadata();
  }

  loadRepertoire(repertoireId: string): Promise<Repertoire> {
    return this.delegate_.loadRepertoire(repertoireId);
  }

  updateRepertoire(
      repertoireId: string, repertoire: Repertoire): Promise<void> {
    return this.delegate_.updateRepertoire(repertoireId, repertoire);
  }

  createRepertoire(): Promise<string> {
    return this.delegate_.createRepertoire();
  }

  deleteRepertoire(repertoireId: string): Promise<void> {
    return this.delegate_.deleteRepertoire(repertoireId);
  }

  setPreference(preference: Preference): Promise<void> {
    return this.delegate_.setPreference(preference);
  }

  getPreference(): Promise<Preference> {
    return this.delegate_.getPreference();
  }

  recordStatistics(statisticList: Statistic[]): Promise<void> {
    return this.delegate_.recordStatistics(statisticList);
  }

  loadCumulatedStatistics(repertoireId: string): Promise<CumulatedStatistic[]> {
    return this.delegate_.loadCumulatedStatistics(repertoireId);
  }

  copyRepertoireAsPrivelegedUser(repertoireId: string): Promise<void> {
    return this.delegate_.copyRepertoireAsPrivelegedUser(repertoireId);
  }
}
