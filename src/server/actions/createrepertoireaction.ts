import { CreateRepertoireRequest, CreateRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';

export class CreateRepertoireAction
    implements Action<CreateRepertoireRequest, CreateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: CreateRepertoireRequest, user: string | null):
      Promise<CreateRepertoireResponse> {
    return this.database_
        .createNewRepertoire(assert(user))
        .then(newRepertoireId => {
          return {newRepertoireId};
        });
  }
}
