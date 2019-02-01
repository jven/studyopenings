import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Color } from '../protocol/color';
import { Impression } from '../protocol/impression/impression';
import { mergePreferences, Preference } from '../protocol/preference/preference';
import { CumulatedStatistic } from '../protocol/statistic/cumulatedstatistic';
import { Statistic } from '../protocol/statistic/statistic';
import { StatisticType } from '../protocol/statistic/statistictype';
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

  copyRepertoireForPrivelegedUser(
      repertoireId: string,
      privelegedUser: string): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection
            .findOne({ _id: new ObjectId(repertoireId) })
            .then(doc => {
              if (!doc) {
                throw new Error(
                  `No repertoire found for ID ${repertoireId}.`);
              }
              return collection
                  .insertOne({
                    owner: privelegedUser,
                    name: `[PRIVELEGED COPY] ${doc.name.substring(0, 100)}`,
                    json: {
                      color: Color.WHITE,
                      root: null
                    }
                  })
                  .then(result => collection.findOneAndUpdate(
                      { _id: result.insertedId },
                      { $set: { json: doc.json } }));
            }))
        .then(() => {});
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
      statisticList: Statistic[]): Promise<void> {
    return this.getStatisticsCollection_()
        .then(collection => statisticList.map(
          statistic => collection.findOneAndUpdate(
              {
                studier: studier,
                repertoireId: statistic.repertoireId,
                pgn: statistic.pgn,
              },
              { $inc: this.incrementForStatistic_(statistic) },
              { upsert: true }
          )
        ))
        .then(() => {});
  }

  loadCumulatedStatistics(
      repertoireId: string,
      studier: string): Promise<CumulatedStatistic[]> {
    return this.getStatisticsCollection_()
        .then(collection => collection.find(
            {
              studier: studier,
              repertoireId: repertoireId
            }))
        .then(docs => docs.toArray())
        .then(docs =>
            docs.map(doc => {
              return {
                pgn: doc.pgn,
                rightMoveCount: doc.rightCount || 0,
                wrongMoveCount: doc.wrongCount || 0,
                finishLineCount: doc.finishLineCount || 0
              };
            }));
  }

  private incrementForStatistic_(
      statistic: Statistic): {[key: string]: number} {
    switch (statistic.statisticType) {
      case StatisticType.RIGHT_MOVE:
        return { rightCount: 1 };
      case StatisticType.WRONG_MOVE:
        return { wrongCount: 1 };
      case StatisticType.FINISH_LINE:
        return { finishLineCount: 1 };
      default:
        throw new Error(`Unknown statistic type: ${statistic.statisticType}.`);
    }
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
