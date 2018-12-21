import { MetadataJson, RepertoireJson } from '../protocol/protocol';
import { Repertoire } from './repertoire';

export class RepertoireWithId {
  private repertoire_: Repertoire;
  private id_: string;

  constructor(repertoire: Repertoire, id: string) {
    this.repertoire_ = repertoire;
    this.id_ = id;
  }

  getRepertoire(): Repertoire {
    return this.repertoire_;
  }

  getId(): string {
    return this.id_;
  }

  getMetadata(): MetadataJson {
    return {id: this.id_, name: this.id_};
  }

  serializeForClient(): RepertoireJson {
    return this.repertoire_.getJson();
  }

  static parseFromStorageDocument(
      doc: {[key: string]: any}): RepertoireWithId {
    if (!doc || !doc.json || !doc.owner || !doc._id) {
      throw new Error('Invalid document in storage.');
    }
    return new RepertoireWithId(new Repertoire(doc.json, doc.owner), doc._id);
  }
}