import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../../impressions/impressionsender';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireExporter } from './currentrepertoireexporter';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { TreeView } from './treeview';

export class TreeController {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;
  private exporter_: CurrentRepertoireExporter;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater,
      exporter: CurrentRepertoireExporter) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.updater_ = updater;
    this.exporter_ = exporter;
  }

  handleButtonClicks(
      treeButtonLeftElement: HTMLElement,
      treeButtonRightElement: HTMLElement,
      treeButtonTrashElement: HTMLElement,
      treeButtonExportElement: HTMLElement): void {
    treeButtonLeftElement.onclick = () => this.selectLeft();
    treeButtonRightElement.onclick = () => this.selectRight();
    treeButtonTrashElement.onclick = () => this.trash();
    treeButtonExportElement.onclick = () => this.export();
  }

  flipRepertoireColor(): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.TREE_FLIP_REPERTOIRE_COLOR);
    this.treeModel_.flipRepertoireColor();
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }

  selectLeft(): void {
    if (this.treeModel_.hasPreviousPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_LEFT);
      this.treeModel_.selectPreviousPgn();
      this.treeView_.refresh();
    }
  }

  selectRight(): void {
    if (this.treeModel_.hasNextPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_RIGHT);
      this.treeModel_.selectNextPgn();
      this.treeView_.refresh();
    }
  }

  selectDown(): void {
    if (this.treeModel_.hasNextSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_DOWN);
      this.treeModel_.selectNextSiblingPgn();
      this.treeView_.refresh();
    }
  }

  selectUp(): void {
    if (this.treeModel_.hasPreviousSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_UP);
      this.treeModel_.selectPreviousSiblingPgn();
      this.treeView_.refresh();
    }
  }

  trash(): void {
    if (!this.treeModel_.canRemoveSelectedPgn()) {
      return;
    }

    this.impressionSender_.sendImpression(ImpressionCode.TREE_TRASH_SELECTED);
    this.treeModel_.removeSelectedPgn();
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }

  export(): void {
    this.impressionSender_.sendImpression(ImpressionCode.PGN_EXPORT);
    this.exporter_.exportCurrentRepertoire();
  }
}
