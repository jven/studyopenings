import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { ServerWrapper } from '../server/serverwrapper';
import { PickerController } from '../picker/pickercontroller';

export class TreeController {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private pickerController_: PickerController;
  private server_: ServerWrapper;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      pickerController: PickerController,
      server: ServerWrapper) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.pickerController_ = pickerController;
    this.server_ = server;
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
    this.updateCurrentRepertoire_();
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
    this.updateCurrentRepertoire_();
  }

  private updateCurrentRepertoire_(): void {
    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    this.server_.updateRepertoire(repertoireId, repertoire);
  }
}