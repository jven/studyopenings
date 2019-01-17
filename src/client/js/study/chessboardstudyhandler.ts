import { LineStudier } from './linestudier';

export class ChessBoardStudyHandler {
  private lineStudier_: LineStudier;

  constructor(lineStudier: LineStudier) {
    this.lineStudier_ = lineStudier;
  }

  onMove(fromSquare: string, toSquare: string) {
    this.lineStudier_.tryMove({fromSquare, toSquare});
  }
}
