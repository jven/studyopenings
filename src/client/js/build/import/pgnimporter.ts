import { Repertoire } from '../../../../protocol/storage';
import { Config } from '../../common/config';
import { Toasts } from '../../common/toasts';
import { ConverterStatus } from './converterstatus';
import { PgnImportProgress } from './pgnimportprogress';
import { RepertoireIncrementalConverter } from './repertoireincrementalconverter';

export class PgnImporter {
  static startPgnImport(pgn: string): PgnImportProgress {
    const status = new ConverterStatus();
    const converter = new RepertoireIncrementalConverter(pgn, status);
    const progress = new FinishablePgnImportProgress(status);

    setTimeout(() => this.doModeWork_(progress, converter, status), 0);
    return progress;
  }

  private static doModeWork_(
      progress: FinishablePgnImportProgress,
      converter: RepertoireIncrementalConverter,
      status: ConverterStatus): void {
    if (progress.isComplete()) {
      return;
    }

    if (converter.isComplete()) {
      PgnImporter.maybeShowInfoToasts_(status);
      progress.markFinished(converter.getRepertoire());
      return;
    }

    const errors = status.getErrors();
    if (errors.length) {
      errors.forEach(e => Toasts.error('Error importing PGN.', e));
      progress.cancel();
      return;
    }

    converter.doIncrementalWork();
    setTimeout(() => PgnImporter.doModeWork_(progress, converter, status), 0);
  }

  private static maybeShowInfoToasts_(status: ConverterStatus): void {
    if (status.wasAnyLongLineTruncated()) {
      Toasts.info(
          'Some lines were shortened',
          `Opening lines can\'t be longer than `
              + `${Config.MAXIMUM_LINE_DEPTH_IN_PLY} ply.`);
    }
    if (status.wasMaximumNumNodesReached()) {
      Toasts.info(
          'Some moves were not imported',
          `Repertoires can\'t contain more than `
              + `${Config.MAXIMUM_TREE_NODES_PER_REPERTOIRE} total moves.`);
    }
  }
}

class FinishablePgnImportProgress implements PgnImportProgress {
  private status_: ConverterStatus;
  private promise_: Promise<Repertoire>;
  private resolveFn_: (repertoire: Repertoire) => void;
  private rejectFn_: () => void;
  private completed_: boolean;

  constructor(status: ConverterStatus) {
    this.status_ = status;
    this.resolveFn_ = () => {};
    this.rejectFn_ = () => {};
    this.promise_ = new Promise<Repertoire>((resolve, reject) => {
      this.resolveFn_ = resolve;
      this.rejectFn_ = reject;
    });
    this.completed_ = false;
  }

  getStatusString(): string {
    return this.status_.getLabel();
  }

  getCompletionPromise(): Promise<Repertoire> {
    return this.promise_;
  }

  isComplete(): boolean {
    return this.completed_;
  }

  cancel(): void {
    if (this.completed_) {
      throw new Error('Import has already completed.');
    }

    this.rejectFn_();
    this.completed_ = true;
  }

  markFinished(repertoire: Repertoire): void {
    if (this.completed_) {
      throw new Error('Import has already completed.');
    }

    this.resolveFn_(repertoire);
    this.completed_ = true;
  }
}
