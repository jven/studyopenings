import { RefreshableView } from './refreshableview';

export class ListRefreshableView implements RefreshableView {
  private views_: RefreshableView[];

  constructor() {
    this.views_ = [];
  }

  addView(view: RefreshableView): void {
    this.views_.push(view);
  }

  refresh(): void {
    this.views_.forEach(v => v.refresh());
  }
}
