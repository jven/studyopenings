import { RefreshableView } from '../../common/refreshableview';
import { InsightCalculator } from './insightcalculator';

enum CssClass {
  INSIGHT = 'insight',
  INSIGHT_TITLE = 'insightTitle',
  INSIGHT_VALUE = 'insightValue'
}

export class InsightsPanel implements RefreshableView {
  private insightsEl_: HTMLElement;
  private calculator_: InsightCalculator;

  constructor(
      insightsEl: HTMLElement,
      calculator: InsightCalculator) {
    this.insightsEl_ = insightsEl;
    this.calculator_ = calculator;
  }

  refresh(): void {
    this.insightsEl_.innerHTML = '';
    this.calculator_.calculate().forEach(insight => {
      const titleEl = document.createElement('div');
      titleEl.classList.add(CssClass.INSIGHT_TITLE);
      titleEl.innerText = insight.title;

      const valueEl = document.createElement('div');
      valueEl.classList.add(CssClass.INSIGHT_VALUE);
      valueEl.innerText = '...';
      insight.value.then(v => { valueEl.innerText = v; });

      const insightEl = document.createElement('div');
      insightEl.classList.add(CssClass.INSIGHT);
      insightEl.appendChild(titleEl);
      insightEl.appendChild(valueEl);

      this.insightsEl_.appendChild(insightEl);
    });
  }
}
