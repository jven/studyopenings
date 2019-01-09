import { Repertoire } from "../../../../protocol/storage";
import { TreeModel } from "../../tree/treemodel";
import { Move } from "../../common/move";

export class RepertoireIncrementalConverter {
  private pgn_: string;
  private treeModel_: TreeModel;
  private moves_: Map<string, Move>;
  private repertoire_: Repertoire | null;

  constructor(pgn: string) {
    this.pgn_ = pgn;
    this.treeModel_ = new TreeModel();
    this.moves_ = new Map<string, Move>();
    this.repertoire_ = null;
  }

  doIncrementalWork(): void {
    if (this.repertoire_) {
      throw new Error('Already done generating!');
    }

    this.treeModel_.addMove('', new Move('e2', 'e4'));
    this.treeModel_.addMove('1. e4', new Move('e7', 'e5'));
    this.treeModel_.addMove('1. e4 e5', new Move('g1', 'f3'));
    this.treeModel_.addMove('1. e4 e5 2. Nf3', new Move('b8', 'c6'));
    this.treeModel_.addMove('1. e4 e5 2. Nf3 Nc6', new Move('f1', 'b5'));
    this.treeModel_.addMove('1. e4 e5 2. Nf3 Nc6 3. Bb5', new Move('a7', 'a6'));

    this.treeModel_.addMove('1. e4', new Move('e7', 'e6'));
    this.treeModel_.addMove('1. e4 e6', new Move('d2', 'd4'));
    this.treeModel_.addMove('1. e4 e6 2. d4', new Move('d7', 'd5'));

    this.treeModel_.addMove('1. e4 e6 2. d4 d5', new Move('e4', 'd5'));
    this.treeModel_.addMove('1. e4 e6 2. d4 d5 3. exd5', new Move('e6', 'd5'));

    this.treeModel_.addMove('1. e4 e6 2. d4 d5', new Move('e4', 'e5'));
    this.treeModel_.addMove('1. e4 e6 2. d4 d5 3. e5', new Move('c7', 'c5'));

    this.repertoire_ = this.treeModel_.serializeAsRepertoire();
  }

  isComplete(): boolean {
    return !!this.repertoire_;
  }

  getGeneratedRepertoire(): Repertoire {
    if (!this.repertoire_) {
      throw new Error('Not done generating yet!');
    }

    return this.repertoire_;
  }
}