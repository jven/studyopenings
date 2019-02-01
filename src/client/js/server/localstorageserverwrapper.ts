import { Color } from '../../../protocol/color';
import { mergePreferences, Preference } from '../../../protocol/preference/preference';
import { CumulatedStatistic } from '../../../protocol/statistic/cumulatedstatistic';
import { Statistic } from '../../../protocol/statistic/statistic';
import { StatisticType } from '../../../protocol/statistic/statistictype';
import { Metadata, Repertoire } from '../../../protocol/storage';
import { ServerWrapper } from './serverwrapper';

interface StorageFormat {
  [repertoireId: string]: Repertoire
}

export class LocalStorageServerWrapper implements ServerWrapper {
  private localStorage_: Storage;

  constructor(localStorage: Storage) {
    this.localStorage_ = localStorage;
  }

  getAllRepertoireMetadata(): Promise<Metadata[]> {
    const s = this.parseStorage_() || {};
    const ans: Metadata[] = [];
    for (const repertoireId in s) {
      ans.push({
        id: repertoireId,
        name: s[repertoireId].name
      });
    }

    return Promise.resolve(ans);
  }

  loadRepertoire(repertoireId: string): Promise<Repertoire> {
    const s = this.parseStorage_();
    if (!s) {
      throw new Error('No stored repertoires!');
    }
    if (!s[repertoireId]) {
      throw new Error('Repertoire to load not found in storage.');
    }

    return Promise.resolve(s[repertoireId]);
  }

  updateRepertoire(
      repertoireId: string, repertoire: Repertoire): Promise<void> {
    const s = this.parseStorage_();
    if (!s) {
      throw new Error('No stored repertoires!');
    }
    if (!s[repertoireId]) {
      throw new Error('Repertoire to update not found in storage.');
    }

    s[repertoireId] = repertoire;
    this.putInStorage_(s);

    return Promise.resolve();
  }

  createRepertoire(): Promise<string> {
    const s = this.parseStorage_() || {};
    const newRepertoireId = '' + (1 + this.highestKey_(s));
    s[newRepertoireId] = {
      name: 'Untitled repertoire',
      color: Color.WHITE,
      root: null
    };
    this.putInStorage_(s);

    return Promise.resolve(newRepertoireId);
  }

  deleteRepertoire(repertoireId: string): Promise<void> {
    const s = this.parseStorage_();
    if (!s) {
      throw new Error('No stored repertoires!');
    }
    if (!s[repertoireId]) {
      throw new Error('Repertoire to delete not found in storage.');
    }

    delete s[repertoireId];
    this.putInStorage_(s);

    return Promise.resolve();
  }

  setPreference(newPreference: Preference): Promise<void> {
    return this.getPreference()
        .then(existingPreference => {
          const mergedPreference =
              mergePreferences(existingPreference, newPreference);
          this.localStorage_.setItem(
              'anonymous_preference', JSON.stringify(mergedPreference));
        });
  }

  getPreference(): Promise<Preference> {
    const rawPreference = this.localStorage_.getItem('anonymous_preference');
    const preference = rawPreference ? JSON.parse(rawPreference) : {};
    return Promise.resolve(preference);
  }

  recordStatistics(statisticList: Statistic[]): Promise<void> {
    const rawAllStatistics
        = this.localStorage_.getItem('anonymous_statistics');
    const allStatistics = rawAllStatistics ? JSON.parse(rawAllStatistics) : {};
    statisticList.forEach(statistic => {
      const repertoireStatistics = allStatistics[statistic.repertoireId] || {};
      const pgnStatistics = repertoireStatistics[statistic.pgn]
          || {pgn: statistic.pgn, rightMoveCount: 0, wrongMoveCount: 0};
      if (statistic.statisticType == StatisticType.RIGHT_MOVE) {
        pgnStatistics.rightMoveCount++;
      }
      if (statistic.statisticType == StatisticType.WRONG_MOVE) {
        pgnStatistics.wrongMoveCount++;
      }
      repertoireStatistics[statistic.pgn] = pgnStatistics;
      allStatistics[statistic.repertoireId] = repertoireStatistics;
    });

    this.localStorage_.setItem(
        'anonymous_statistics', JSON.stringify(allStatistics));
    return Promise.resolve();
  }

  loadCumulatedStatistics(repertoireId: string): Promise<CumulatedStatistic[]> {
    const rawAllStatistics
        = this.localStorage_.getItem('anonymous_statistics');
    const allStatistics = rawAllStatistics ? JSON.parse(rawAllStatistics) : {};
    const repertoireStatistics = allStatistics[repertoireId] || {};
    const ans: CumulatedStatistic[] = [];
    for (let pgn in repertoireStatistics) {
      ans.push({
        pgn: pgn,
        rightMoveCount: repertoireStatistics[pgn].rightMoveCount || 0,
        wrongMoveCount: repertoireStatistics[pgn].wrongMoveCount || 0
      });
    }
    return Promise.resolve(ans);
  }

  copyRepertoireAsPrivelegedUser(): Promise<void> {
    throw new Error('Priveleged copy requires logging in as priveleged user.');
  }

  private parseStorage_(): StorageFormat | null {
    const stored = this.localStorage_.getItem('anonymous_repertoire');
    if (!stored) {
      return null;
    }

    const ans: StorageFormat = {};
    const map = JSON.parse(stored);
    for (const repertoireId in map) {
      const value = map[repertoireId];
      if (!value || !value.color) {
        return null;
      }

      ans[repertoireId] = {
        name: value.name,
        color: value.color,
        root: value.root || null
      };
    }

    return ans;
  }

  private putInStorage_(map: StorageFormat) {
    this.localStorage_.setItem('anonymous_repertoire', JSON.stringify(map));
  }

  private highestKey_(map: StorageFormat): number {
    let ans = 0;
    for (const repertoireId in map) {
      ans = Math.max(ans, Number.parseInt(repertoireId));
    }

    return ans;
  }
}
