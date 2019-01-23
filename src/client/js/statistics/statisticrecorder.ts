export interface StatisticRecorder {
  recordRightMove(pgn: string): void;

  recordWrongMove(pgn: string): void;
}
