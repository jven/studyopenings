import { RefreshableView } from '../common/refreshableview';
import { TreeModel } from './treemodel';

export class EmptyMessage implements RefreshableView {
  private treeModel_: TreeModel;
  private emptyEl_: HTMLElement;

  constructor(treeModel: TreeModel, emptyEl: HTMLElement) {
    this.treeModel_ = treeModel;
    this.emptyEl_ = emptyEl;
  }

  refresh(): void {
    const hideEmptyMessage = !this.treeModel_.isEmpty();
    this.emptyEl_.classList.toggle('hidden', hideEmptyMessage);
  }
}
