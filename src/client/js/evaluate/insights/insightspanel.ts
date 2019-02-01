import { RefreshableView } from '../../common/refreshableview';
import { Insight } from './insight';
import { InsightCalculator } from './insightcalculator';

enum CssClass {
  INSIGHT = 'insight',
  INSIGHT_TITLE = 'insightTitle',
  INSIGHT_VALUE = 'insightValue',
  INSIGHT_LABEL = 'insightLabel'
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
    this.calculator_.calculate().forEach(e => this.handleElement_(e));
  }

  private handleElement_(e: Insight | string): void {
    typeof e == 'string'
        ? this.handleInsightLabel_(e)
        : this.handleInsight_(e);
  }

  private handleInsight_(insight: Insight): void {
    const titleEl = document.createElement('div');
    titleEl.classList.add(CssClass.INSIGHT_TITLE);
    titleEl.innerText = insight.title;
    titleEl.style.color = insight.color;
    titleEl.style.borderColor = insight.color;

    const valueEl = document.createElement('div');
    valueEl.classList.add(CssClass.INSIGHT_VALUE);
    valueEl.innerText = '...';
    valueEl.style.color = insight.color;
    insight.value.then(v => { valueEl.innerText = `${v}`; });

    const insightEl = document.createElement('div');
    insightEl.classList.add(CssClass.INSIGHT);
    insightEl.appendChild(titleEl);
    insightEl.appendChild(valueEl);

    this.insightsEl_.appendChild(insightEl);
  }

  private handleInsightLabel_(insightLabel: string): void {
    const labelEl = document.createElement('div');
    labelEl.classList.add(CssClass.INSIGHT_LABEL);
    labelEl.innerText = insightLabel;

    this.insightsEl_.appendChild(labelEl);
  }
}
