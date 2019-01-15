import { MetadataRequest, MetadataResponse } from '../../protocol/actions';
import { Action } from '../action';
import { DatabaseWrapper } from '../databasewrapper';

export class RepertoireMetadataAction implements
    Action<MetadataRequest, MetadataResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  do(request: MetadataRequest, user: string): Promise<MetadataResponse> {
    return this.database_
        .getMetadataListForOwner(user)
        .then(metadataList => { return { metadataList }; });
  }
}
