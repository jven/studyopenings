import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Color } from '../protocol/color';
import { Config } from './config';
import { Metadata, RepertoireJson } from '../protocol/protocol';

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

  createNewRepertoire(owner: string): Promise<void> {
    return this.getRepertoireCollection_()
        .then(collection => collection.insertOne({
          owner: owner,
          name: 'Untitled repertoire',
          json: {
            color: Color.WHITE,
            root: null
          }
        }))
        .then(() => {})
        .catch(err => console.error(err));
  }

  updateRepertoire(
      repertoireId: string,
      repertoireJson: RepertoireJson,
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
                name: repertoireJson.name,
                json: {
                  color: repertoireJson.color,
                  root: repertoireJson.root
                }
              }})
        )
        .then(() => {})
        .catch(err => console.error(err));
  }

  getRepertoireForOwner(
      repertoireId: string, owner: string): Promise<RepertoireJson> {
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
            name: doc.name || doc._id,
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
                name: doc.name || 'Untitled repertoire'
              };
            }));
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