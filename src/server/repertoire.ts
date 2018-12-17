export class Repertoire {
  private id_: string | null;
  private json_: Object;
  private owner_: string;

  constructor(id: string | null, json: Object, owner: string) {
    this.id_ = id;
    this.json_ = json;
    this.owner_ = owner;
  }

  getId(): string | null {
    return this.id_;
  }

  getOwner(): string {
    return this.owner_;
  }

  serializeForClient(): Object {
    return this.json_;
  }

  getMetadata(): Object {
    return {id: this.id_};
  }

  serializeForStorage(): Object {
    return this.id_ ?
        {
          json: this.json_,
          owner: this.owner_,
          id_: this.id_
        } :
        {
          json: this.json_,
          owner: this.owner_
        };
  }

  static parseFromStorageDocument(doc: {[key: string]: string}): Repertoire {
    if (!doc || !doc.json || !doc.owner || !doc._id) {
      throw new Error('Invalid document in storage.');
    }
    return new Repertoire(doc._id, doc.json, doc.owner);
  }
}
