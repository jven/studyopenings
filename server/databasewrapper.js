const Config = require('./config.js').Config;
const MongoClient = require('mongodb').MongoClient;
const Repertoire = require('./repertoire.js').Repertoire;

class DatabaseWrapper {
  constructor() {
    this.database_ = null;
  }

  connect(databasePath) {
    if (this.database_) {
      console.error('Tried to connect to a database more than once!');
      return;
    }
    console.log('Using database path: ' + databasePath);
    MongoClient.connect(
        databasePath,
        {useNewUrlParser: true},
        this.onDatabaseConnect_.bind(this));
  }

  saveRepertoire(repertoire) {
    return this.getRepertoireCollection_()
        .then(collection => {
          collection.findOneAndReplace(
              {owner: repertoire.getOwner()},
              repertoire.serializeForStorage(),
              {upsert: true})
          return true;
        })
        .catch(err => console.error(err));
  }

  getRepertoiresForOwner(owner) {
    return this.getRepertoireCollection_()
        .then(collection => collection.find({owner: owner}))
        .then(docs => docs.toArray())
        .then(docs => docs.map(doc => Repertoire.parseFromStorageDocument(doc)))
        .catch(err => console.error(err));
  }

  getRepertoireCollection_() {
    const promise = new Promise(function(resolve, reject) {
      if (!this.database_) {
        reject("Tried to operate on repertoire collection without connecting " +
            "to database.");
        return;
      }
      this.database_
          .db(Config.DATABASE_NAME)
          .collection(
              Config.REPERTOIRE_COLLECTION_NAME,
              (err, collection) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(collection);
                }
              });
    }.bind(this));
    return promise;
  }

  onDatabaseConnect_(err, databaseConnection) {
    if (err) {
      console.error('Error connecting to database: ' + err);
      return;
    }
    this.database_ = databaseConnection;
  }
}

exports.DatabaseWrapper = DatabaseWrapper;