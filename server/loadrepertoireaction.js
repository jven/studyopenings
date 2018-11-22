class LoadRepertoireAction {
  constructor(database) {
    this.database_ = database;
  }

  post(request, response) {
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