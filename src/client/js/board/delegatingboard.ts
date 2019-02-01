import { Color } from '../../../protocol/color';
import { Board } from './board';
import { NoOpBoard } from './noopboard';

export class DelegatingBoard implements Board {
  private delegate_: Board;

  constructor() {
    this.delegate_ = new NoOpBoard();
  }

  setDelegate(delegate: Board): void {
    this.delegate_ = delegate;
  }

  redraw(): void {
    this.delegate_.redraw();
  }

  setStateFromChess(chess: any): void {
    this.delegate_.setStateFromChess(chess);
  }

  setInitialPositionImmediately(): void {
    this.delegate_.setInitialPositionImmediately();
  }

  setOrientationForColor(color: Color): void {
    this.delegate_.setOrientationForColor(color);
  }

  flashRightMove(): void {
    this.delegate_.flashRightMove();
  }

  flashWrongMove(): void {
    this.delegate_.flashWrongMove();
  }

  flashFinishLine(): void {
    this.delegate_.flashFinishLine();
  }

  drawCircle(square: string, color: string): void {
    this.delegate_.drawCircle(square, color);
  }

  drawArrow(from: string, to: string | null, color: string): void {
    this.delegate_.drawArrow(from, to, color);
  }

  removeHints(): void {
    this.delegate_.removeHints();
  }
}
