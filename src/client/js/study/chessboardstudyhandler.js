import { Move } from '../common/move';

export class ChessBoardStudyHandler {
  constructor(lineStudier) {
    this.lineStudier_ = lineStudier;
  }

  onMove(fromSquare, toSquare) {
    this.lineStudier_.tryMove(new Move(fromSquare, toSquare));
  }
}