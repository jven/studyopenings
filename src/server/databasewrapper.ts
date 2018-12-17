import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Config } from './config';
import { Repertoire } from './repertoire';

export class DatabaseWrapper {
  private mongoClient_: MongoClient | null; 

  constructor() {
    this.mongoClient_ = null;
  }

  connect(databasePath: string) {
    if (this.mongoClient_) {
      console.error('Tried to connect to a database more than once!');
      return;
    }
    console.log('Using database path: ' + databasePath);
    MongoClient.connect(
        databasePath,
        {useNewUrlParser: true},
        this.onDatabaseConnect_.bind(this));
  }

  saveRepertoire(repertoire: Repertoire): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => {
          collection.findOneAndReplace(
              {owner: repertoire.getOwner()},
              repertoire.serializeForStorage(),
              {upsert: true})
        })
        .catch(err => console.error(err));
  }

  getRepertoireForOwner(repertoireId: string, owner: string):
      Promise<Repertoire> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne(
            {_id: new ObjectId(repertoireId), owner: owner}))
        .then(doc => {
          if (!doc) {
            throw new Error('No document found with ID ' + repertoireId
                + ' and owner ' + owner + '.');
          }
          return Repertoire.parseFromStorageDocument(doc);
        });
  }

  getRepertoiresForOwner(owner: string): Promise<Repertoire[]> {
    return this.getRepertoireCollection_()
        .then(collection => collection.find({owner}))
        .then(docs => docs.toArray())
        .then(docs =>
            docs.map(doc => Repertoire.parseFromStorageDocument(doc)));
  }

  getRepertoireCollection_(): Promise<Collection> {
    const promise = new Promise<Collection>(
        function(this: DatabaseWrapper, resolve: Function, reject: Function) {
          if (!this.mongoClient_) {
            reject('Tried to operate on repertoire collection without '
                + 'connecting to database.');
            return;
          }
          this.mongoClient_
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

  onDatabaseConnect_(err: Error, mongoClient: MongoClient) {
    if (err) {
      console.error('Error connecting to database: ' + err);
      return;
    }
    this.mongoClient_ = mongoClient;
  }
}