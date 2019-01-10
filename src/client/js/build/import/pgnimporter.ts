import { Repertoire } from "../../../../protocol/storage";
import { PgnImportProgress } from "./pgnimportprogress";
import { RepertoireIncrementalConverter } from "./repertoireincrementalconverter";

export class PgnImporter {
  static importPgn(pgn: string): PgnImportProgress {
    const progress = new FinishablePgnImportProgress();
    const converter = new RepertoireIncrementalConverter(pgn);

    while (!converter.isComplete()) {
      converter.doIncrementalWork();
    }

    if (!converter.isComplete()) {
      throw new Error('Converter is unexpectedly incomplete.');
    }
    progress.markFinished(converter.getRepertoire());
    return progress;
  }
}

class FinishablePgnImportProgress implements PgnImportProgress {
  private promise_: Promise<Repertoire>;
  private resolveFn_: (repertoire: Repertoire) => void;
  private rejectFn_: () => void;
  private completed_: boolean;

  constructor() {
    this.resolveFn_ = (repertoire) => {};
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