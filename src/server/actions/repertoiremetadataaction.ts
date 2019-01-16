import { MetadataRequest, MetadataResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';

export class RepertoireMetadataAction implements
    Action<MetadataRequest, MetadataResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: MetadataRequest, user: string | null): Promise<MetadataResponse> {
    return this.database_
        .getMetadataListForOwner(assert(user))
        .then(metadataList => { return { metadataList }; });
  }
}
