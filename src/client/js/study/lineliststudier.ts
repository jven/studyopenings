import { Line } from './line';
import { LineShuffler } from './lineshuffler';
import { LineStudier } from './linestudier';

const SHUFFLE_TIME_MS = 700;
const NEXT_LINE_DELAY_MS = 1200;

export class LineListStudier {
  static study(
      lines: Line[],
      lineStudier: LineStudier,
      messageEl: HTMLElement) {
    if (!lines.length) {
      throw new Error('Need at least one line to study.');
    }

    LineListStudier.studyLine_(
        lineStudier,
        messageEl,
        lines,
        lines.length);
  }

  private static studyLine_(
      lineStudier: LineStudier,
      messageEl: HTMLElement,
      shuffledLines: Line[],
      lineIndex: number): void {
    if (lineIndex >= shuffledLines.length) {
      messageEl.innerText = `Shuffling ${shuffledLines.length} lines...`;
      messageEl.classList.remove('hidden');

      setTimeout(
          () => LineListStudier.studyLine_(
              lineStudier,
              messageEl,
              LineShuffler.shuffle(shuffledLines),
              0),
          SHUFFLE_TIME_MS);
      return;
    }

    messageEl.innerText = `${lineIndex} / ${shuffledLines.length} lines `
        + `studied`;
    lineStudier.study(shuffledLines[lineIndex]).then(success => {
      if (success) {
        messageEl.innerText = `${lineIndex + 1} / ${shuffledLines.length} `
            + `lines studied`;
        setTimeout(
            () => LineListStudier.studyLine_(
                lineStudier,
                messageEl,
                shuffledLines,
                lineIndex + 1),
            NEXT_LINE_DELAY_MS);
      }
    });
  }
}
