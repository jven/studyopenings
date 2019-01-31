import { Insight } from './insight';

enum InsightColor {
  GRAY = '#dfdfdf',
  YELLOW = '#ffd700',
  GREEN = 'rgb(155, 199, 0)',
  RED = 'red'
}

export class InsightCalculator {
  calculate(): Insight[] {
    return [
      {
        title: 'Lines in repertoire',
        value: Promise.resolve('12'),
        color: InsightColor.GRAY
      },
      {
        title: 'Positions in repertoire',
        value: Promise.resolve('35'),
        color: InsightColor.GRAY
      },
      {
        title: 'Times you completed studying a line',
        value: Promise.resolve('142'),
        color: InsightColor.YELLOW
      },
      {
        title: 'Times you played a correct move',
        value: Promise.resolve('677'),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played a wrong move',
        value: Promise.resolve('90'),
        color: InsightColor.RED
      },
      {
        title: 'Times you played correct move in selected position',
        value: this.fakeValue_(
            this.randInt_(2, 10),
            this.randInt_(500, 3000)),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played wrong move in selected position',
        value: this.fakeValue_(
            this.randInt_(0, 2),
            this.randInt_(500, 3000)),
        color: InsightColor.RED
      }
    ];
  }

  private fakeValue_(ans: number, timeout: number): Promise<string> {
    return new Promise(resolve => {
      const timeout = this.randInt_(500, 3000);
      const ans = this.randInt_(2, 10);
      setTimeout(() => resolve(`${ans}`), timeout);
    });
  }

  private randInt_(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
  }
}
