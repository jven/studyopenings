import { CreateRepertoireRequest, CreateRepertoireResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

const MAX_REPERTOIRES_PER_USER = 20;

export class CreateRepertoireAction
    implements Action<CreateRepertoireRequest, CreateRepertoireResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(request: CreateRepertoireRequest, user: string | null):
      Promise<CheckRequestResult> {
    return this.database_.getMetadataListForOwner(assert(user))
        .then(metadataList => {
          return metadataList.length >= MAX_REPERTOIRES_PER_USER
              ? {
                success: false,
                failureMessage: `Cannot have more than `
                    + `${MAX_REPERTOIRES_PER_USER} repertoires per user.`
              }
              : { success: true };
        });
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
