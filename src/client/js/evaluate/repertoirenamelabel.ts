import { RefreshableView } from '../common/refreshableview';
import { TreeModel } from '../tree/treemodel';

export class RepertoireNameLabel implements RefreshableView {
  private labelEl_: HTMLElement;
  private treeModel_: TreeModel;

  constructor(labelEl: HTMLElement, treeModel: TreeModel) {
    this.labelEl_ = labelEl;
    this.treeModel_ = treeModel;
  }

  refresh(): void {
    this.labelEl_.innerText = this.treeModel_.getRepertoireName();
  }
}
