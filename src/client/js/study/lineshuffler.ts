import { Line } from './line';

export class LineShuffler {
  static shuffle(lines: Line[]): Line[] {
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
