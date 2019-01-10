import { Repertoire } from "../../../../protocol/storage";
import { PgnImportProgress } from "./pgnimportprogress";
import { RepertoireIncrementalConverter } from "./repertoireincrementalconverter";
import { Toasts } from "../../common/toasts";

export class PgnImporter {
  static startPgnImport(pgn: string): PgnImportProgress {
    const progress = new FinishablePgnImportProgress();
    const converter = new RepertoireIncrementalConverter(pgn);

    setTimeout(() => this.doModeWork_(progress, converter), 0);
    return progress;
  }

  private static doModeWork_(
      progress: FinishablePgnImportProgress,
      converter: RepertoireIncrementalConverter): void {
    if (converter.isComplete()) {
      progress.markFinished(converter.getRepertoire());
      return;
    }

    try {
      converter.doIncrementalWork();
      setTimeout(() => this.doModeWork_(progress, converter), 0);
    } catch (e) {
      Toasts.error('Error parsing PGN.', e.message || 'Unknown error.');
      progress.cancel();
    }
  }
}

class FinishablePgnImportProgress implements PgnImportProgress {
  private promise_: Promise<Repertoire>;
  private resolveFn_: (repertoire: Repertoire) => void;
  private rejectFn_: () => void;
  private completed_: boolean;

  constructor() {
    this.resolveFn_ = () => {};
    this.rejectFn_ = () => {};
    this.promise_ = new Promise<Repertoire>((resolve, reject) => {
      this.resolveFn_ = resolve;
      this.rejectFn_ = reject;
    });
    this.completed_ = false;
  }

  getCompletionPromise(): Promise<Repertoire> {
    return this.promise_;
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