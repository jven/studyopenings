import { Config } from '../common/config';
import { LineStudier } from './linestudier';
import { LineIterator } from './lineiterator';

export class LineIteratorStudier {
  private lineStudier_: LineStudier;
  private lineIterator_: LineIterator | null;

  constructor(lineStudier: LineStudier) {
    this.lineStudier_ = lineStudier;
    this.lineIterator_ = null;
  }

  study(lineIterator: LineIterator): void {
    this.lineIterator_ = lineIterator;
    this.studyNextLine_();
  }

  private studyNextLine_(): void {
    if (!this.lineIterator_) {
      throw new Error('No repertoire!');
    }

    var line = this.lineIterator_.getNextLine();
    if (!line) {
      return;
    }
    this.lineStudier_.study(line).then(success => {
      if (success) {
        setTimeout(
            this.studyNextLine_.bind(this),
            Config.NEXT_LINE_DELAY_MS);
      }
    });
  }
}