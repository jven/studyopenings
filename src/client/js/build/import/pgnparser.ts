const pgnparser = require('../../lib/pgnparser');

export interface ParsedVariation {
  moves: ParsedNode[]
}

export interface ParsedNode {
  move: string,
  ravs?: ParsedVariation[]
}

export class PgnParser {
  static parse(pgn: string): ParsedVariation {
    if (!pgn) {
      throw new Error('PGN is empty.');
    }
    const result = pgnparser.parse(pgn);
    if (!result || !result.length) {
      throw new Error('Unknown parsing error.');
    }
    return result[0];
  }
}