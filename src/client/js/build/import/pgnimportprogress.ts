import { Repertoire } from "../../../../protocol/storage";

export interface PgnImportProgress {
  getCompletionPromise(): Promise<Repertoire>;

  cancel(): void;
}