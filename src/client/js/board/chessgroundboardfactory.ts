import { assert } from '../../../util/assert';
import { SoundPlayer } from '../sound/soundplayer';
import { BoardHandler } from './boardhandler';
import { ChessgroundBoard } from './chessgroundboard';
import { DelegatingBoard } from './delegatingboard';

export class ChessgroundBoardFactory {
  private soundPlayer_: SoundPlayer;
  private boardIds_: string[];

  constructor(soundPlayer: SoundPlayer) {
    this.soundPlayer_ = soundPlayer;
    this.boardIds_ = [];
  }

  createBoardAndSetDelegate(
      delegatingBoard: DelegatingBoard,
      boardId: string,
      handler: BoardHandler): void {
    const boardEl = assert(document.getElementById(boardId));
    const chessgroundBoard = new ChessgroundBoard(
        boardEl, handler, this.soundPlayer_);

    delegatingBoard.setDelegate(chessgroundBoard);
    this.boardIds_.push(boardId);
  }

  getBoardIds(): string[] {
    return this.boardIds_;
  }
}
