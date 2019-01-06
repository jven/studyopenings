import { Color } from '../../../protocol/color';
import { Line } from './line';
import { RepertoireModel } from '../tree/repertoiremodel';
import { ViewInfo } from '../common/viewinfo';

export class Repertoire {
  private lines_: Line[];
  private shuffledLines_: Line[];
  private currentIndex_: number;

  constructor(lines: Line[]) {
    this.lines_ = lines;
    this.shuffledLines_ = [];
    this.currentIndex_ = 0;
  }

  getNextLine(): Line | null {
    if (!this.lines_.length) {
      return null;
    }

    if (this.currentIndex_ >= this.shuffledLines_.length) {
      this.shuffledLines_ = Repertoire.shuffle_(this.lines_);
      this.currentIndex_ = 0;
    }

    const nextLine = this.shuffledLines_[this.currentIndex_];
    this.currentIndex_++;
    return nextLine;
  }

  private static shuffle_(lines: Line[]): Line[] {
    const ans: Line[] = [];
    for (let i = 0; i < lines.length; i++) {
      ans[i] = lines[i];
    }
    for (let i = 0; i < lines.length; i++) {
      const swapIndex = i + Math.floor(Math.random() * (lines.length - i));
      const dummy = ans[i];
      ans[i] = ans[swapIndex];
      ans[swapIndex] = dummy;
    }

    return ans;
  }
}
