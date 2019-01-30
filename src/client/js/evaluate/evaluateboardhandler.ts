import { BoardHandler } from '../board/boardhandler';

export class EvaluateBoardHandler implements BoardHandler {
  onMove(from: string, to: string): void {}

  onChange(): void {}

  onScroll(e: WheelEvent): void {}
}
