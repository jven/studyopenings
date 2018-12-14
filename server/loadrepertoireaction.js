class LoadRepertoireAction {
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
    this.database_
        .loadRepertoire(request.user.sub)
        .then(r => {
          response.send(r ? r.serializeForClient() : {});
        })
        .catch(err => {
          response.send({});
        });
  }
}

exports.LoadRepertoireAction = LoadRepertoireAction;