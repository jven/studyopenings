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

    if (!request.rightPgns.length && !request.wrongPgns.length) {
      return Promise.resolve({
        success: false,
        failureMessage: 'Must provide at least one right PGN or wrong PGN.'
      });
    }

    return Promise.resolve({ success: true });
  }

  do(request: RecordStatisticsRequest, user: string | null):
      Promise<RecordStatisticsResponse> {
    const rightPgnCounts = this.asCountMap_(request.rightPgns);
    const wrongPgnCounts = this.asCountMap_(request.wrongPgns);

    return this.database_
        .recordStatistics(
            assert(user),
            request.repertoireId,
            rightPgnCounts,
            wrongPgnCounts)
        .then(() => {
          return {};
        });
  }

  private asCountMap_(pgns: string[]): Map<string, number> {
    const pgnCounts = new Map<string, number>();
    pgns.forEach(pgn => {
      if (!pgnCounts.has(pgn)) {
        pgnCounts.set(pgn, 0);
      }
      const count = pgnCounts.get(pgn);
      pgnCounts.set(pgn, count! + 1);
    });

    return pgnCounts;
  }
}
