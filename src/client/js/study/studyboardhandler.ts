import { BoardHandler } from '../board/boardhandler';
import { LineStudier } from './linestudier';

export class StudyBoardHandler implements BoardHandler {
  private lineStudier_: LineStudier;

  constructor(lineStudier: LineStudier) {
    this.lineStudier_ = lineStudier;
  }

  onMove(fromSquare: string, toSquare: string): void {
    this.lineStudier_.tryMove({fromSquare, toSquare});
  }

  onChange(): void {}

  onScroll(): void {}
}
