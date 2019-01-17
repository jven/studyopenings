import { Color } from '../../../protocol/color';
import { Move } from '../../../protocol/move';
import { Annotation } from '../annotate/annotation';

export interface ViewInfo {
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
  annotation: Annotation | null
}
