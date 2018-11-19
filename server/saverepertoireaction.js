const Repertoire = require('./repertoire.js').Repertoire;

class SaveRepertoireAction {
  constructor(database) {
    this.database_ = database;
  }

  post(request, response) {
    if (!request.body) {
      response
          .status(400)
          .send("Expecting JSON object with 'repertoire' field.");
      return;
    }
    const repertoire = new Repertoire(request.body, 'jven');
    this.database_
        .saveRepertoire(repertoire)
        .then(() => {
          response.send({success: true});
        })
        .catch(err => {
          response.send({success: false});
        });

  }
}

exports.SaveRepertoireAction = SaveRepertoireAction;