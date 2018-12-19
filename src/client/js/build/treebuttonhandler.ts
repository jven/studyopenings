import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';

export class TreeButtonHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;

  constructor(repertoireModel: RepertoireModel, treeView: TreeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  handleButtonClicks(
      treeButtonLeftElement: HTMLElement,
      treeButtonRightElement: HTMLElement,
      treeButtonTrashElement: HTMLElement): void {
    treeButtonLeftElement.onclick = this.handleLeft_.bind(this);
    treeButtonRightElement.onclick = this.handleRight_.bind(this);
    treeButtonTrashElement.onclick = this.handleTrash_.bind(this);
  }

  private handleLeft_(): void {
    this.repertoireModel_.selectPreviousPgn();
    this.treeView_.refresh();
  }

  private handleRight_(): void {
    this.repertoireModel_.selectNextPgn();
    this.treeView_.refresh();
  }

  private handleTrash_(): void {
    this.repertoireModel_.removeSelectedPgn();
    this.treeView_.refresh();
  }
}