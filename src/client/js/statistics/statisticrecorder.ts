export interface StatisticRecorder {
  recordRightMove(repertoireId: string, pgn: string): void;

  recordWrongMove(repertoireId: string, pgn: string): void;
}
