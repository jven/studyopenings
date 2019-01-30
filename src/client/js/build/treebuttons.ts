import { RefreshableView } from '../common/refreshableview';
import { TreeModel } from '../tree/treemodel';
import { TreeNavigator } from '../tree/treenavigator';
import { TreeController } from './treecontroller';

enum Classes {
  DISABLED = 'disabled',
  HIDDEN = 'hidden',
  SELECTABLE = 'selectable',

  NODE = 'treeViewNode',
  SELECTED_NODE = 'selectedNode',

  ROW = 'treeViewRow',
  SEGMENT = 'treeViewSegment'
}

export class TreeButtons implements RefreshableView {
  private buttonsEl_: HTMLElement;
  private leftButton_: HTMLElement;
  private rightButton_: HTMLElement;
  private trashButton_: HTMLElement;
  private exportButton_: HTMLElement;
  private treeModel_: TreeModel;

  constructor(
      buttonsEl: HTMLElement,
      leftButton: HTMLElement,
      rightButton: HTMLElement,
      trashButton: HTMLElement,
      exportButton: HTMLElement,
      treeModel: TreeModel,
      treeController: TreeController,
      treeNavigator: TreeNavigator) {
    this.buttonsEl_ = buttonsEl;
    this.leftButton_ = leftButton;
    this.rightButton_ = rightButton;
    this.trashButton_ = trashButton;
    this.exportButton_ = exportButton;
    this.treeModel_ = treeModel;

    leftButton.onclick = () => treeNavigator.selectLeft();
    rightButton.onclick = () => treeNavigator.selectRight();
    trashButton.onclick = () => treeController.trash();
    exportButton.onclick = () => treeController.export();
  }

  refresh(): void {
    // Show/hide the empty tree element as necessary.
    let isModelEmpty = this.treeModel_.isEmpty();
    this.buttonsEl_.classList.toggle(Classes.HIDDEN, isModelEmpty);

    // Disable the tree buttons as necessary.
    let hasPrevious = this.treeModel_.hasPreviousPgn();
    this.leftButton_.classList.toggle(Classes.DISABLED, !hasPrevious);
    this.leftButton_.classList.toggle(Classes.SELECTABLE, hasPrevious);

    let hasNext = this.treeModel_.hasNextPgn();
    this.rightButton_.classList.toggle(Classes.DISABLED, !hasNext);
    this.rightButton_.classList.toggle(Classes.SELECTABLE, hasNext);

    let canTrash = this.treeModel_.canRemoveSelectedPgn();
    this.trashButton_.classList.toggle(Classes.DISABLED, !canTrash);
    this.trashButton_.classList.toggle(Classes.SELECTABLE, canTrash);

    this.exportButton_.classList.add(Classes.SELECTABLE);
  }
}
