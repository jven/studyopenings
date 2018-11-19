class LoadRepertoireAction {
  constructor(database) {
    this.database_ = database;
  }

  post(request, response) {
    this.database_
        .loadRepertoire('jven')
        .then(r => {
          response.send({repertoire: r ? r.serializeForClient() : null});
        })
        .catch(err => {
          response.send(null);
        });
  }
}

exports.LoadRepertoireAction = LoadRepertoireAction;