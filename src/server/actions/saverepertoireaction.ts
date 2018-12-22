import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';
import { Repertoire } from '../repertoire';
import { RepertoireWithId } from '../repertoirewithid';
import { SaveRepertoireRequest, SaveRepertoireResponse } from '../../protocol/actions';

export class SaveRepertoireAction implements
    Action<SaveRepertoireRequest, SaveRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: SaveRepertoireRequest, user: string):
      Promise<SaveRepertoireResponse> {
    const repertoireWithId = new RepertoireWithId(
        new Repertoire(request.repertoireJson, user),
        request.repertoireId);
    return this.database_
        .updateRepertoire(repertoireWithId)
        .then(() => { return {}; });

  }
}
