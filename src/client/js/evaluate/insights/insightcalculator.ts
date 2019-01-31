import { Insight } from './insight';

export class InsightCalculator {
  calculate(): Insight[] {
    return [
      {
        title: 'Number of lines',
        value: Promise.resolve('12')
      },
      {
        title: 'Number of positions',
        value: Promise.resolve('35')
      }
    ];
  }
}
