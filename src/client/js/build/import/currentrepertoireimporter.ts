import { TreeModel } from "../../tree/treemodel";
import { CurrentRepertoireUpdater } from "../currentrepertoireupdater";
import { TreeView } from "../treeview";
import { PgnImporter } from "./pgnimporter";
import { RenameInput } from "../renameinput";
import { PickerController } from "../../picker/pickercontroller";
import { ImportDialog } from "./importdialog";
import { PgnImportProgress } from "./pgnimportprogress";

export class CurrentRepertoireImporter {
  private importDialog_: ImportDialog;
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private renameInput_: RenameInput;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  private currentProgress_: PgnImportProgress | null;

  constructor(
      importDialog: ImportDialog,
      treeModel: TreeModel,
      treeView: TreeView,
      renameInput: RenameInput,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.importDialog_ = importDialog;
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.renameInput_ = renameInput;
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
          this.treeView_.refresh();
          this.renameInput_.refresh();

          this.updater_.updateCurrentRepertoire().then(
              () => this.pickerController_.updatePicker());
          this.currentProgress_ = null;
        })
        .catch(err => {
          this.importDialog_.setImportButtonEnabled(true);
          this.currentProgress_ = null;
        });
  }

  cancelCurrentProgress(): void {
    if (this.currentProgress_) {
      this.currentProgress_.cancel();
      this.currentProgress_ = null;
    }
  }
}