import { Color } from './color';

export interface TreeNodeJson {
  pgn: string,
  fen: string,
  nlm: number, // numLegalMoves
  ctm: string, // colorToMove
  lmf: string, // lastMoveFromSquare
  lmt: string, // lastMoveToSquare
  lms: string, // lastMoveString
  c: TreeNodeJson[] // children
}

export interface RepertoireJson {
  color: Color,
  root: TreeNodeJson
}