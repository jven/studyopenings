export interface StatisticsModel {
  getRightMoveCount(pgn: string): Promise<number>;

  getWrongMoveCount(pgn: string): Promise<number>;
}
