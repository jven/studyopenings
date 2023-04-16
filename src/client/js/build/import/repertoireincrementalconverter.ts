import { Repertoire } from '../../../../protocol/storage';
import { ConverterStatus } from './converterstatus';
import { ParsedVariation, PgnParser } from './pgnparser';
import { TreeModelPopulator } from './treemodelpopulator';

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
  private status_: ConverterStatus;
  private parsedVariations_: ParsedVariation[] | null;
  private populator_: TreeModelPopulator | null;
  private repertoire_: Repertoire | null;

  constructor(pgn: string, status: ConverterStatus) {
    this.pgn_ = pgn;
    this.status_ = status;
    this.parsedVariations_ = null;
    this.populator_ = null;
    this.repertoire_ = null;

    status.setLabel('Parsing PGN...');
  }

  doIncrementalWork(): void {
    if (this.repertoire_) {
      throw new Error('Already done generating!');
    }
    if (!this.parsedVariations_) {
      try {
        this.parsedVariations_ = PgnParser.parse(this.pgn_);
      } catch (e) {
        let message = (e as any).message;
        if ((e as any).location && (e as any).location.start) {
          const l = (e as any).location.start;
          message = `At line ${l.line}, column ${l.column}: ${message}`;
        }
        this.status_.addError(message);
      }
      return;
    }
    if (!this.populator_) {
      this.populator_ = new TreeModelPopulator(
          this.parsedVariations_, this.status_);
      return;
    }
    if (!this.populator_.isComplete()) {
      this.populator_.doIncrementalWork();
      this.status_.setLabel(`Imported ${this.populator_.numPopulatedMoves()} / `
          + `${this.populator_.numTotalMoves()} moves...`);
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
