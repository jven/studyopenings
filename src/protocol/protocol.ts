import { Color } from './color';

export interface MetadataJson {
  id: string,
  name: string
}

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
  name: string,
  color: Color,
  root: TreeNodeJson | null
}