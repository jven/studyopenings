import { Repertoire } from "../../../../protocol/storage";
import { TreeModel } from "../../tree/treemodel";
import { Move } from "../../common/move";
import { PgnParser, ParsedVariation } from "./pgnparser";
import { TreeModelPopulator } from "./treemodelpopulator";

/**
 * A class which incrementally converts a PGN string into a Repertoire object.
 *
 * This conversion is done by constructing this Converter with the PGN string to
 * convert then repeatedly calling #doIncrementalWork until #isComplete returns
 * true. At that point, #getRepertoire will return the resulting repertoire.
 *
 * Since PGN parsing and conversion is expensive, this flow is intended to allow
 * the caller to only perform the conversion work when there is nothing else to
 * do (e.g. handling user input).
 */
export class RepertoireIncrementalConverter {
  private pgn_: string;
  private parsedVariation_: ParsedVariation | null;
  private populator_: TreeModelPopulator | null;
  private repertoire_: Repertoire | null;

  constructor(pgn: string) {
    this.pgn_ = pgn;
    this.parsedVariation_ = null;
    this.populator_ = null;
    this.repertoire_ = null;
  }

  doIncrementalWork(): void {
    if (this.repertoire_) {
      throw new Error('Already done generating!');
    }
    if (!this.parsedVariation_) {
      this.parsedVariation_ = PgnParser.parse(this.pgn_);
      return;
    }
    if (!this.populator_) {
      this.populator_ = new TreeModelPopulator(this.parsedVariation_);
      return;
    }
    if (!this.populator_.isComplete()) {
      this.populator_.doIncrementalWork();
      return;
    }

    const treeModel = this.populator_.getPopulatedTreeModel();
    this.repertoire_ = treeModel.serializeAsRepertoire();
  }

  isComplete(): boolean {
    return !!this.repertoire_;
  }

  getRepertoire(): Repertoire {
    if (!this.repertoire_) {
      throw new Error('Not done generating yet!');
    }

    return this.repertoire_;
  }
}