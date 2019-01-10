import { ServerWrapper } from "./serverwrapper";
import { Metadata, Repertoire } from "../../../protocol/storage";
import { Color } from "../../../protocol/color";

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