class Repertoire {
  constructor(json, owner) {
    this.json_ = json;
    this.owner_ = owner;
  }

  getOwner() {
    return this.owner_;
  }

  serializeForClient() {
    return this.json_;
  }

  serializeForStorage() {
    return {
      json: this.json_,
      owner: this.owner_
    };
  }

  static parseFromStorageDocument(doc) {
    if (!doc || !doc.json || !doc.owner) {
      return null;
    }
    return new Repertoire(doc.json, doc.owner);
  }
}

exports.Repertoire = Repertoire;