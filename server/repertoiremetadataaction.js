class RepertoireMetadataAction {
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
        .getRepertoiresForOwner(request.user.sub)
        .then(repertoires => repertoires.map(r => r.getMetadata()))
        .then(metadata => response.send(metadata))
        .catch(err => {
          console.error(err);
          response
              .status(500)
              .send(err);
        });
  }
}

exports.RepertoireMetadataAction = RepertoireMetadataAction;