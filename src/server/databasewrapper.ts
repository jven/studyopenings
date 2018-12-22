import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Config } from './config';
import { Repertoire } from './repertoire';
import { RepertoireWithId } from './repertoirewithid';

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

  deleteRepertoire(repertoireId: string, owner: string): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne({
          _id: new ObjectId(repertoireId),
          owner: owner
        }))
        .then(existingDoc => {
          if (!existingDoc) {
            throw new Error('Repertoire to delete not found!');
          }
        })
        .then(() => this.getRepertoireCollection_())
        .then(collection => 
          collection.deleteOne({
            _id: new ObjectId(repertoireId),
            owner: owner
          })
        )
        .then(() => {});
  }

  createNewRepertoire(repertoire: Repertoire): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection.insertOne({
          owner: repertoire.getOwner(),
          json: repertoire.getJson()
        }))
        .then(() => {})
        .catch(err => console.error(err));
  }

  updateRepertoire(repertoireWithId: RepertoireWithId): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne(
            {
              _id: new ObjectId(repertoireWithId.getId()),
              owner: repertoireWithId.getRepertoire().getOwner()
            }))
        .then(existingDoc => {
          if (!existingDoc) {
            throw new Error('Repertoire to update not found!');
          }
        })
        .then(() => this.getRepertoireCollection_())
        .then(collection =>
          collection.findOneAndUpdate(
              {
                _id: new ObjectId(repertoireWithId.getId()),
                owner: repertoireWithId.getRepertoire().getOwner()
              },
              {
                $set: {
                  json: repertoireWithId.getRepertoire().getJson()
                }
              })
        )
        .then(() => {})
        .catch(err => console.error(err));
  }

  getRepertoireForOwner(repertoireId: string, owner: string):
      Promise<RepertoireWithId> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne(
            {
              _id: new ObjectId(repertoireId),
              owner: owner
            }))
        .then(doc => {
          if (!doc) {
            throw new Error('No document found with ID ' + repertoireId
                + ' and owner ' + owner + '.');
          }
          return RepertoireWithId.parseFromStorageDocument(doc);
        });
  }

  getRepertoiresForOwner(owner: string): Promise<RepertoireWithId[]> {
    return this.getRepertoireCollection_()
        .then(collection => collection.find({owner}))
        .then(docs => docs.toArray())
        .then(docs =>
            docs.map(doc => RepertoireWithId.parseFromStorageDocument(doc)));
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