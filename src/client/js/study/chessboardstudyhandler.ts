import { LineStudier } from './linestudier';
import { Move } from '../common/move';

export class ChessBoardStudyHandler {
  private lineStudier_: LineStudier;

  constructor(lineStudier: LineStudier) {
    this.lineStudier_ = lineStudier;
  }

  onMove(fromSquare: string, toSquare: string) {
    this.lineStudier_.tryMove(new Move(fromSquare, toSquare));
  }
}