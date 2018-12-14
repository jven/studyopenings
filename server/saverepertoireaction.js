const Repertoire = require('./repertoire.js').Repertoire;

class SaveRepertoireAction {
  constructor(database) {
    this.database_ = database;
  }

  post(request, response) {
    if (!request.user || !request.user.sub) {
      response
          .status(403)
          .send('You are not logged in.');
          return;
    }
    if (!request.body || !request.body.repertoireJson) {
      response
          .status(400)
          .send('Expecting JSON-encoded body.');
      return;
    }
    const repertoire = new Repertoire(
        request.body.repertoireJson, request.user.sub);
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