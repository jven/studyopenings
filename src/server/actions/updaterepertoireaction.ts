import { UpdateRepertoireRequest, UpdateRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

const MAX_REPERTOIRE_NAME_LENGTH = 200;

export class UpdateRepertoireAction implements
    Action<UpdateRepertoireRequest, UpdateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(request: UpdateRepertoireRequest): CheckRequestResult {
    if (request.repertoire.name.length > MAX_REPERTOIRE_NAME_LENGTH) {
      return {
        success: false,
        failureMessage: `Repertoire name must not exceed `
            + `${MAX_REPERTOIRE_NAME_LENGTH} characters.`
      };
    }

    return { success: true };
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
