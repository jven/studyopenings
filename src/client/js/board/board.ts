import { Color } from '../../../protocol/color';

export interface Board {
  redraw(): void;

  setStateFromChess(chess: any): void;

  setInitialPositionImmediately(): void;

  setOrientationForColor(color: Color): void;

  flashRightMove(): void;

  flashWrongMove(): void;

  flashFinishLine(): void;

  drawCircle(square: string, color: string): void;

  drawArrow(from: string, to: string | null, color: string): void;

  removeHints(): void;
}
