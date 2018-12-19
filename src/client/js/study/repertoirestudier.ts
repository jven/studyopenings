import { Config } from '../common/config';
import { LineStudier } from './linestudier';
import { Repertoire } from './repertoire';

export class RepertoireStudier {
  private lineStudier_: LineStudier;
  private repertoire_: Repertoire | null;

  constructor(lineStudier: LineStudier) {
    this.lineStudier_ = lineStudier;
    this.repertoire_ = null;
  }

  study(repertoire: Repertoire): void {
    this.repertoire_ = repertoire;
    this.studyNextLine_();
  }

  private studyNextLine_(): void {
    if (!this.repertoire_) {
      throw new Error('No repertoire!');
    }

    var line = this.repertoire_.getNextLine();
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