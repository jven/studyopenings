import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Color } from '../protocol/color';
import { Impression } from '../protocol/impression/impression';
import { mergePreferences, Preference } from '../protocol/preference';
import { Metadata, Repertoire } from '../protocol/storage';

const DATABASE_NAME = 'studyopenings';

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

  recordStatistics(
      studier: string,
      repertoireId: string,
      rightPgnCounts: Map<string, number>,
      wrongPgnCounts: Map<string, number>): Promise<void> {
    return this.getStatisticsCollection_()
        .then(collection => {
          const allPromises: Promise<any>[] = [];
          rightPgnCounts.forEach(
              (rightCount, rightPgn) => {
                allPromises.push(
                    collection.findOneAndUpdate(
                        {
                          repertoireId: repertoireId,
                          studier: studier,
                          pgn: rightPgn
                        },
                        { $inc: { rightCount: rightCount } }
                    )
                );
              }
          );
          wrongPgnCounts.forEach(
              (wrongCount, wrongPgn) => {
                allPromises.push(
                    collection.findOneAndUpdate(
                        {
                          repertoireId: repertoireId,
                          studier: studier,
                          pgn: wrongPgn
                        },
                        { $inc: { wrongCount: wrongCount } }
                    )
                );
              }
          );

          return Promise.all(allPromises);
        })
        .then(() => {});
  }

  addImpressions(impressions: Impression[]): Promise<void> {
    return this.getImpressionsCollection_()
        .then(collection => collection.insertMany(impressions))
        .then(() => {});
  }

  setPreferenceForUser(newPreference: Preference, user: string): Promise<void> {
    return this.getPreferencesCollection_()
        .then(collection => collection.findOne({user})
            .then(doc => {
              const mergedPreference = doc
                  ? mergePreferences(doc.preference, newPreference)
                  : newPreference;
              return collection.replaceOne(
                  {user},
                  {
                    user: user,
                    preference: mergedPreference
                  },
                  { upsert: true });
            }))
        .then(() => {});
  }

  getPreferenceForUser(user: string): Promise<Preference> {
    return this.getPreferencesCollection_()
        .then(collection => collection.findOne({user}))
        .then(doc => doc ? doc.preference : {});
  }

  private getRepertoireCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.REPERTOIRES);
  }

  private getImpressionsCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.IMPRESSIONS);
  }

  private getPreferencesCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.PREFERENCES);
  }

  private getStatisticsCollection_(): Promise<Collection> {
    return this.getCollection_(CollectionName.STATISTICS);
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
              .db(DATABASE_NAME)
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
  IMPRESSIONS = 'impressions',
  PREFERENCES = 'preferences',
  STATISTICS = 'statistics'
}
