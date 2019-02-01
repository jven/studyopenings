import { Color } from '../../../protocol/color';
import { Board } from './board';

export class NoOpBoard implements Board {
  redraw(): void {}

  setStateFromChess(chess: any): void {}

  setInitialPositionImmediately(): void {}

  setOrientationForColor(color: Color): void {}

  flashRightMove(): void {}

  flashWrongMove(): void {}

  flashFinishLine(): void {}

  drawCircle(square: string, color: string): void {}

  drawArrow(from: string, to: string, color: string): void {}

  removeHints(): void {}
}
