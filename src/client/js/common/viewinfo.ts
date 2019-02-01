import { Color } from '../../../protocol/color';
import { Move } from '../../../protocol/move';

export interface ViewInfo<ANNOTATION> {
  position: string,
  pgn: string,
  parentPgn: string | null,
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
  annotationPromise: Promise<ANNOTATION>
}
