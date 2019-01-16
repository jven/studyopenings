import { UpdateRepertoireRequest, UpdateRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';

export class UpdateRepertoireAction implements
    Action<UpdateRepertoireRequest, UpdateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: UpdateRepertoireRequest, user: string | null):
      Promise<UpdateRepertoireResponse> {
    return this.database_
        .updateRepertoire(
            request.repertoireId,
            request.repertoire,
            assert(user))
        .then(() => { return {}; });
  }
}
