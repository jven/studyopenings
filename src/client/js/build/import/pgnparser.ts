const pgnparser = require('../../lib/pgnparser');

export interface ParsedVariation {
  moves: ParsedNode[]
}

export interface ParsedNode {
  move: string,
  ravs: ParsedVariation[] | undefined
}

export class PgnParser {
  static parse(pgn: string): ParsedVariation {
    const result = pgnparser.parse(pgn);
    if (!result || !result.length) {
      throw new Error('Unexpected parse result.');
    }
    return result[0];
  }
}