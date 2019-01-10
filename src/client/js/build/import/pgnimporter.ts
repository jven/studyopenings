import { Repertoire } from "../../../../protocol/storage";
import { PgnImportProgress } from "./pgnimportprogress";
import { RepertoireIncrementalConverter } from "./repertoireincrementalconverter";
import { Toasts } from "../../common/toasts";

export class PgnImporter {
  static startPgnImport(pgn: string): PgnImportProgress {
    const converter = new RepertoireIncrementalConverter(pgn);
    const progress = new FinishablePgnImportProgress(converter);

    setTimeout(() => this.doModeWork_(progress, converter), 0);
    return progress;
  }

  private static doModeWork_(
      progress: FinishablePgnImportProgress,
      converter: RepertoireIncrementalConverter): void {
    if (progress.isComplete()) {
      return;
    }

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
  private converter_: RepertoireIncrementalConverter;
  private promise_: Promise<Repertoire>;
  private resolveFn_: (repertoire: Repertoire) => void;
  private rejectFn_: () => void;
  private completed_: boolean;

  constructor(converter: RepertoireIncrementalConverter) {
    this.converter_ = converter;
    this.resolveFn_ = () => {};
    this.rejectFn_ = () => {};
    this.promise_ = new Promise<Repertoire>((resolve, reject) => {
      this.resolveFn_ = resolve;
      this.rejectFn_ = reject;
    });
    this.completed_ = false;
  }

  getStatusString(): string {
    return this.converter_.getStatusString();
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