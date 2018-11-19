const MongoClient = require('mongodb').MongoClient;

class DatabaseWrapper {
  constructor(databasePath) {
    this.database_ = null;
    console.log('Connecting to database at \'' + databasePath + '\'...');
    MongoClient.connect(
        databasePath,
        {useNewUrlParser: true},
        this.onDatabaseConnect_.bind(this));
  }

  onDatabaseConnect_(err, database) {
    console.log('Successfully connected to database!');
    this.database_ = database;
  }
}

exports.DatabaseWrapper = DatabaseWrapper;