import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { PickerController } from '../picker/pickercontroller';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class TreeController {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.updater_ = updater;
  }

  handleButtonClicks(
      treeButtonLeftElement: HTMLElement,
      treeButtonRightElement: HTMLElement,
      treeButtonTrashElement: HTMLElement): void {
    treeButtonLeftElement.onclick = () => this.selectLeft();
    treeButtonRightElement.onclick = () => this.selectRight();
    treeButtonTrashElement.onclick = () => this.trash();
  }

  flipRepertoireColor(): void {
    this.repertoireModel_.flipRepertoireColor();
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }

  selectLeft(): void {
    if (this.repertoireModel_.hasPreviousPgn()) {
      this.repertoireModel_.selectPreviousPgn();
      this.treeView_.refresh();
    }
  }

  selectRight(): void {
    if (this.repertoireModel_.hasNextPgn()) {
      this.repertoireModel_.selectNextPgn();
      this.treeView_.refresh();
    }
  }

  selectDown(): void {
    if (this.repertoireModel_.hasNextSiblingPgn()) {
      this.repertoireModel_.selectNextSiblingPgn();
      this.treeView_.refresh();
    }
  }

  selectUp(): void {
    if (this.repertoireModel_.hasPreviousSiblingPgn()) {
      this.repertoireModel_.selectPreviousSiblingPgn();
      this.treeView_.refresh();
    }
  }

  trash(): void {
    if (!this.repertoireModel_.canRemoveSelectedPgn()) {
      return;
    }

    this.repertoireModel_.removeSelectedPgn();
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }
}