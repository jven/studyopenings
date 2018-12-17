import { Color } from './color';
import { Move } from './move';
import { Transposition } from './transposition';

export interface ViewInfo {
  position: string,
  pgn: string,
  numLegalMoves: number,
  colorToMove: Color,
  lastMove: Move | null,
  lastMoveString: string,
  lastMoveVerboseString: string,
  lastMovePly: number,
  lastMoveNumber: number,
  lastMoveColor: Color,
  numChildren: number,
  childPgns: string[],
  isSelected: boolean,
  warnings: string[],
  transposition: Transposition | null
};
