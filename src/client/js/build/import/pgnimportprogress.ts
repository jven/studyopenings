import { Repertoire } from '../../../../protocol/storage';

export interface PgnImportProgress {
  getStatusString(): string;

  getCompletionPromise(): Promise<Repertoire>;

  cancel(): void;
}
