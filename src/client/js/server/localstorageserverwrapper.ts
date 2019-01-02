import { ServerWrapper } from "./serverwrapper";
import { Metadata, Repertoire } from "../../../protocol/storage";

export class LocalStorageServerWrapper implements ServerWrapper {
  private localStorage_: Storage;

  constructor(localStorage: Storage) {
    this.localStorage_ = localStorage;
  }

  getAllRepertoireMetadata(): Promise<Metadata[]> {
    return Promise.resolve([{ 'id': 'fake', name: 'Untitled repertoire' }]);
  }
  
  loadRepertoire(repertoireId: string): Promise<Repertoire> {
    return Promise.resolve(
        JSON.parse(this.localStorage_.getItem('anonymous_repertoire') || '{}'));
  }

  updateRepertoire(repertoireId: string, repertoire: Repertoire): Promise<void> {
    this.localStorage_.setItem(
        'anonymous_repertoire', JSON.stringify(repertoire));
    return Promise.resolve();
  }

  createRepertoire(): Promise<string> {
    return Promise.resolve('fake');
  }

  deleteRepertoire(repertoireId: string): Promise<void> {
    return Promise.resolve();
  }
}