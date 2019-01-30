import { assert } from '../../../util/assert';
import { SoundPlayer } from '../sound/soundplayer';
import { BoardHandler } from './boardhandler';
import { ChessgroundBoard } from './chessgroundboard';
import { DelegatingBoard } from './delegatingboard';

export class ChessgroundBoardFactory {
  private soundPlayer_: SoundPlayer;
  private boardEls_: HTMLElement[];

  constructor(soundPlayer: SoundPlayer) {
    this.soundPlayer_ = soundPlayer;
    this.boardEls_ = [];
  }

  createBoardAndSetDelegate(
      delegatingBoard: DelegatingBoard,
      boardId: string,
      handler: BoardHandler,
      viewOnly: boolean): void {
    const boardEl = assert(document.getElementById(boardId));
    const chessgroundBoard = new ChessgroundBoard(
        boardEl,
        handler,
        this.soundPlayer_,
        viewOnly);

    delegatingBoard.setDelegate(chessgroundBoard);
    this.boardEls_.push(boardEl);
  }

  getBoardElements(): HTMLElement[] {
    return this.boardEls_;
  }
}
