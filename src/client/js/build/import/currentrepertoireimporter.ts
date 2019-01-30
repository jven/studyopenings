import { RefreshableView } from '../../common/refreshableview';
import { PickerController } from '../../picker/pickercontroller';
import { TreeModel } from '../../tree/treemodel';
import { CurrentRepertoireUpdater } from '../currentrepertoireupdater';
import { ImportDialog } from './importdialog';
import { PgnImporter } from './pgnimporter';
import { PgnImportProgress } from './pgnimportprogress';

export class CurrentRepertoireImporter {
  private importDialog_: ImportDialog;
  private treeModel_: TreeModel;
  private modeView_: RefreshableView;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  private currentProgress_: PgnImportProgress | null;

  constructor(
      importDialog: ImportDialog,
      treeModel: TreeModel,
      modeView: RefreshableView,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.importDialog_ = importDialog;
    this.treeModel_ = treeModel;
    this.modeView_ = modeView;
    this.pickerController_ = pickerController;
    this.updater_ = updater;

    this.currentProgress_ = null;
  }

  startPgnImport(pgn: string): void {
    if (this.currentProgress_) {
      throw new Error('An import is already in progress!');
    }

    this.currentProgress_ = PgnImporter.startPgnImport(pgn);
    this.currentProgress_
        .getCompletionPromise()
        .then(repertoire => {
          this.importDialog_.hide();
          this.treeModel_.loadRepertoire(repertoire);
          this.modeView_.refresh();

          this.updater_.updateCurrentRepertoire().then(
              () => this.pickerController_.updatePicker());
          this.currentProgress_ = null;
        })
        .catch(err => {
          this.importDialog_.hideProgress();
          this.currentProgress_ = null;
        });

    this.maybeUpdateProgressText_();
  }

  cancelCurrentProgress(): void {
    if (this.currentProgress_) {
      this.importDialog_.hideProgress();
      this.currentProgress_.cancel();
      this.currentProgress_ = null;
    }
  }

  private maybeUpdateProgressText_(): void {
    if (!this.currentProgress_) {
      return;
    }

    this.importDialog_.showProgress(this.currentProgress_.getStatusString());
    setTimeout(() => this.maybeUpdateProgressText_(), 500);
  }
}
