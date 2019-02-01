import { LoadCumulatedStatisticsRequest, LoadCumulatedStatisticsResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';

export class LoadCumulatedStatisticsAction implements
    Action<LoadCumulatedStatisticsRequest, LoadCumulatedStatisticsResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(): Promise<CheckRequestResult> {
    return Promise.resolve({ success: true });
  }

  do(request: LoadCumulatedStatisticsRequest, user: string | null):
      Promise<LoadCumulatedStatisticsResponse> {
    return this.database_
        .loadCumulatedStatistics(request.repertoireId, assert(user))
        .then(cumulatedStatisticList => { return { cumulatedStatisticList }; });
  }
}
