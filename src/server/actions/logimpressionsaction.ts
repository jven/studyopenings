import { LogImpressionsRequest, LogImpressionsResponse } from '../../protocol/actions';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class LogImpressionsAction
    implements Action<LogImpressionsRequest, LogImpressionsResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): CheckRequestResult {
    return { success: true };
  }

  do(request: LogImpressionsRequest): Promise<LogImpressionsResponse> {
    return this.database_
        .addImpressions(request.impressions)
        .then(() => {
          return {};
        });
  }
}
