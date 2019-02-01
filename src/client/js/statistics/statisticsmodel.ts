export interface StatisticsModel {
  getRepertoireRightMoveCount(): Promise<number>;

  getRepertoireWrongMoveCount(): Promise<number>;

  getRightMoveCount(pgn: string): Promise<number>;

  getWrongMoveCount(pgn: string): Promise<number>;
}
