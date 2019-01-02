import { Color } from './color';

export interface Metadata {
  id: string,
  name: string
}

export interface RepertoireNode {
  pgn: string,
  fen: string,
  nlm: number, // numLegalMoves
  ctm: string, // colorToMove
  lmf: string, // lastMoveFromSquare
  lmt: string, // lastMoveToSquare
  lms: string, // lastMoveString
  c: RepertoireNode[] // children
}

export interface Repertoire {
  name: string,
  color: Color,
  root: RepertoireNode | null
}