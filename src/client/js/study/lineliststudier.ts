import { Line } from './line';
import { LineShuffler } from './lineshuffler';
import { LineStudier } from './linestudier';

const SHUFFLE_TIME_MS = 700;
const NEXT_LINE_DELAY_MS = 1200;

export class LineListStudier {
  private lineStudier_: LineStudier;
  private messageEl_: HTMLElement;
  private currentTimeout_: NodeJS.Timeout | null;

  constructor(lineStudier: LineStudier, messageEl: HTMLElement) {
    this.lineStudier_ = lineStudier;
    this.messageEl_ = messageEl;
    this.currentTimeout_ = null;
  }

  cancelStudy() {
    if (this.currentTimeout_ != null) {
      clearTimeout(this.currentTimeout_);
      this.currentTimeout_ = null;
    }
  }

  study(lines: Line[]) {
    if (!lines.length) {
      throw new Error('Need at least one line to study.');
    }

    this.cancelStudy();
    this.studyLine_(lines, lines.length);
  }

  private studyLine_(shuffledLines: Line[], lineIndex: number): void {
    if (lineIndex >= shuffledLines.length) {
      this.messageEl_.innerText = `Shuffling ${shuffledLines.length} lines...`;
      this.messageEl_.classList.remove('hidden');

      this.currentTimeout_ = setTimeout(
          () => this.studyLine_(LineShuffler.shuffle(shuffledLines), 0),
          SHUFFLE_TIME_MS);
      return;
    }

    this.messageEl_.innerText = `${lineIndex} / ${shuffledLines.length} lines `
        + `studied`;
    this.lineStudier_.study(shuffledLines[lineIndex]).then(success => {
      if (success) {
        this.messageEl_.innerText = `${lineIndex + 1} / `
            + `${shuffledLines.length} lines studied`;

        const input = window.document.querySelector('#repeateLineCheckbox');
        if ((input as any)?.checked) {
          this.currentTimeout_ = setTimeout(
            () => this.studyLine_(shuffledLines, lineIndex),
            NEXT_LINE_DELAY_MS);
        } else {
          this.currentTimeout_ = setTimeout(
              () => this.studyLine_(shuffledLines, lineIndex + 1),
              NEXT_LINE_DELAY_MS);
        }
      }
    });
  }
}
