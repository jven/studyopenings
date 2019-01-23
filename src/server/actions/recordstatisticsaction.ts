import { FlagName } from '../../flag/flags';
import { RecordStatisticsRequest, RecordStatisticsResponse } from '../../protocol/actions';
import { assert } from '../../util/assert';
import { Action } from '../action';
import { CheckRequestResult } from '../checkrequestresult';
import { DatabaseWrapper } from '../databasewrapper';
import { FlagEvaluator } from '../flagevaluator';

export class RecordStatisticsAction
    implements Action<RecordStatisticsRequest, RecordStatisticsResponse> {
  private database_: DatabaseWrapper;

  constructor(database: DatabaseWrapper) {
    this.database_ = database;
  }

  checkRequest(request: RecordStatisticsRequest, user: string | null):
      Promise<CheckRequestResult> {
    const flags = FlagEvaluator.evaluateAllFlags();
    if (!flags[FlagName.ENABLE_STORING_STATISTICS]) {
      return Promise.resolve({
        success: false,
        failureMessage: 'ENABLE_STORING_STATISTICS flag is disabled.'
      });
    }

    if (!request.statisticList.length) {
      return Promise.resolve({
        success: false,
        failureMessage: 'Must provide at least one statistic.'
      });
    }

    return Promise.resolve({ success: true });
  }

  do(request: RecordStatisticsRequest, user: string | null):
      Promise<RecordStatisticsResponse> {
    return this.database_
        .recordStatistics(assert(user), request.statisticList)
        .then(() => {
          return {};
        });
  }
}
