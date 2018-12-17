class Repertoire {
  constructor(id, json, owner) {
    this.id_ = id;
    this.json_ = json;
    this.owner_ = owner;
  }

  getId() {
    return this.id_;
  }

  getOwner() {
    return this.owner_;
  }

  serializeForClient() {
    return this.json_;
  }

  getMetadata() {
    return {id: this.id_};
  }

  serializeForStorage() {
    const doc = {
      json: this.json_,
      owner: this.owner_
    };
    if (this.id_) {
      doc.id_ = this.id_;
    }
    return doc;
  }

  static parseFromStorageDocument(doc) {
    if (!doc || !doc.json || !doc.owner || !doc._id) {
      throw new Error('Invalid document in storage.');
    }
    return new Repertoire(doc._id, doc.json, doc.owner);
  }
}

exports.Repertoire = Repertoire;