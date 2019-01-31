import { Insight } from './insight';

enum InsightColor {
  GRAY = '#dfdfdf',
  YELLOW = '#ffd700',
  GREEN = 'rgb(155, 199, 0)',
  RED = 'red'
}

export class InsightCalculator {
  calculate(): (Insight | string)[] {
    return [
      'In this repertoire...',
      {
        title: 'Number of lines',
        value: Promise.resolve('12'),
        color: InsightColor.GRAY
      },
      {
        title: 'Number of positions',
        value: Promise.resolve('35'),
        color: InsightColor.GRAY
      },
      {
        title: 'Times you completed studying a line',
        value: Promise.resolve('142'),
        color: InsightColor.YELLOW
      },
      {
        title: 'Times you played a correct move while studying',
        value: Promise.resolve('677'),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played a wrong move while studying',
        value: Promise.resolve('90'),
        color: InsightColor.RED
      },
      'For the selected position...',
      {
        title: 'Times you played the correct move',
        value: this.fakeValue_(
            this.randInt_(2, 10),
            this.randInt_(500, 3000)),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played the wrong move',
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
