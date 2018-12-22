import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';
import { DeleteRepertoireRequest, DeleteRepertoireResponse } from '../../protocol/actions';

export class DeleteRepertoireAction
    implements Action<DeleteRepertoireRequest, DeleteRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: DeleteRepertoireRequest, user: string):
      Promise<DeleteRepertoireResponse> {
    return this.database_
        .deleteRepertoire(request.repertoireId, user)
        .then(() => { return {}; });
  }
}
