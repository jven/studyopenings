import { Collection, MongoClient, ObjectId } from 'mongodb';
import { FlagName } from '../flag/flags';
import { Color } from '../protocol/color';
import { Impression } from '../protocol/impression/impression';
import { Metadata, Repertoire } from '../protocol/storage';
import { Config } from './config';
import { FlagEvaluator } from './flagevaluator';

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

  createNewRepertoire(owner: string): Promise<string> {
    return this.getRepertoireCollection_()
        .then(collection => collection.insertOne({
          owner: owner,
          name: 'Untitled repertoire',
          json: {
            color: Color.WHITE,
            root: null
          }
        }))
        .then(result => result.insertedId.toHexString());
  }

  updateRepertoire(
      repertoireId: string,
      repertoire: Repertoire,
      owner: string): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne(
            {
              _id: new ObjectId(repertoireId),
              owner: owner
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
                _id: new ObjectId(repertoireId),
                owner: owner
              },
              {$set: {
                name: repertoire.name,
                json: {
                  color: repertoire.color,
                  root: repertoire.root
                }
              }})
        )
        .then(() => {});
  }

  getRepertoireForOwner(
      repertoireId: string, owner: string): Promise<Repertoire> {
    return this.getRepertoireCollection_()
        .then(collection => collection.findOne(
            {
              _id: new ObjectId(repertoireId),
              owner: owner
            }))
        .then(doc => {
          if (!doc || !doc.json) {
            throw new Error('No document found with ID ' + repertoireId
                + ' and owner ' + owner + '.');
          }
          return {
            name: doc.name,
            color: doc.json.color,
            root: doc.json.root
          };
        });
  }

  getMetadataListForOwner(owner: string): Promise<Metadata[]> {
    return this.getRepertoireCollection_()
        .then(collection => collection.find({owner}))
        .then(docs => docs.toArray())
        .then(docs =>
            docs.map(doc => {
              return {
                id: doc._id,
                name: doc.name
              };
            }));
  }

  addImpressions(impressions: Impression[]): Promise<void> {
    const flags = FlagEvaluator.evaluateAllFlags();
    if (!flags[FlagName.ENABLE_SERVER_STORE_IMPRESSIONS]) {
      return Promise.resolve();
    }

    return this.getImpressionsCollection_()
        .then(collection => collection.insertMany(impressions))
        .then(() => {});
  }

  private getRepertoireCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.REPERTOIRES);
  }

  private getImpressionsCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.IMPRESSIONS);
  }

  private getCollection_(collectionName: CollectionName): Promise<Collection> {
    return new Promise<Collection>(
        (resolve, reject) => {
          if (!this.mongoClient_) {
            reject('Tried to operate on collection without connecting '
                + 'to database.');
            return;
          }
          this.mongoClient_
              .db(Config.DATABASE_NAME)
              .collection(
                  collectionName,
                  (err, collection) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(collection);
                    }
                  });
        });
  }

  private onDatabaseConnect_(err: Error, mongoClient: MongoClient) {
    if (err) {
      console.error('Error connecting to database: ' + err);
      return;
    }
    this.mongoClient_ = mongoClient;
  }
}

enum CollectionName {
  REPERTOIRES = 'repertoires',
  IMPRESSIONS = 'impressions'
}
