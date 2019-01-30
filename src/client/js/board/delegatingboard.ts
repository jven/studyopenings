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

  hintSquare(square: string): void {
    this.delegate_.hintSquare(square);
  }

  hintMove(from: string, to: string | null): void {
    this.delegate_.hintMove(from, to);
  }

  removeHints(): void {
    this.delegate_.removeHints();
  }
}
