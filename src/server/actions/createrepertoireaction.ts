import { Action } from '../action';
import { Color } from '../../protocol/color';
import { CreateRepertoireRequest, CreateRepertoireResponse } from '../../protocol/actions';
import { DatabaseWrapper } from '../databasewrapper';
import { Repertoire } from '../repertoire';

export class CreateRepertoireAction
    implements Action<CreateRepertoireRequest, CreateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: CreateRepertoireRequest, user: string):
      Promise<CreateRepertoireResponse> {
    const repertoire = new Repertoire({color: Color.WHITE, root: null}, user);
    return this.database_.createNewRepertoire(repertoire)
        .then(() => { return {}; });
  }
}
