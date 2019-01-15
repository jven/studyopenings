export class FenNormalizer {
  static normalize(fen: string, numLegalMoves: number): string {
    // Remove the half move counts and en passant tokens at the end. To treat en
    // passant positions as different, we append the number of legal moves.
    return fen.split(' ').slice(0, 3).join(' ') + numLegalMoves;
  }
}
