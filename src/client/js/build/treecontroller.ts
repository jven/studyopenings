import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireExporter } from './currentrepertoireexporter';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';

export class TreeController {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private modeView_: RefreshableView;
  private updater_: CurrentRepertoireUpdater;
  private exporter_: CurrentRepertoireExporter;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      modeView: RefreshableView,
      updater: CurrentRepertoireUpdater,
      exporter: CurrentRepertoireExporter) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.modeView_ = modeView;
    this.updater_ = updater;
    this.exporter_ = exporter;
  }

  flipRepertoireColor(): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.TREE_FLIP_REPERTOIRE_COLOR);
    this.treeModel_.flipRepertoireColor();
    this.modeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }

  selectLeft(): void {
    if (this.treeModel_.hasPreviousPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_LEFT);
      this.treeModel_.selectPreviousPgn();
      this.modeView_.refresh();
    }
  }

  selectRight(): void {
    if (this.treeModel_.hasNextPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_RIGHT);
      this.treeModel_.selectNextPgn();
      this.modeView_.refresh();
    }
  }

  selectDown(): void {
    if (this.treeModel_.hasNextSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_DOWN);
      this.treeModel_.selectNextSiblingPgn();
      this.modeView_.refresh();
    }
  }

  selectUp(): void {
    if (this.treeModel_.hasPreviousSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_UP);
      this.treeModel_.selectPreviousSiblingPgn();
      this.modeView_.refresh();
    }
  }

  trash(): void {
    if (!this.treeModel_.canRemoveSelectedPgn()) {
      return;
    }

    this.impressionSender_.sendImpression(ImpressionCode.TREE_TRASH_SELECTED);
    this.treeModel_.removeSelectedPgn();
    this.modeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }

  export(): void {
    this.impressionSender_.sendImpression(ImpressionCode.PGN_EXPORT);
    this.exporter_.exportCurrentRepertoire();
  }
}
