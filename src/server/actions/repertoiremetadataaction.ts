import { MetadataRequest, MetadataResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class RepertoireMetadataAction implements
    Action<MetadataRequest, MetadataResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): CheckRequestResult {
    return { success: true };
  }

  do(request: MetadataRequest, user: string | null): Promise<MetadataResponse> {
    return this.database_
        .getMetadataListForOwner(assert(user))
        .then(metadataList => { return { metadataList }; });
  }
}
