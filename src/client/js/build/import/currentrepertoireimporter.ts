import { TreeModel } from "../../tree/treemodel";
import { CurrentRepertoireUpdater } from "../currentrepertoireupdater";
import { TreeView } from "../treeview";
import { PgnImporter } from "./pgnimporter";
import { RenameInput } from "../renameinput";
import { PickerController } from "../../picker/pickercontroller";
import { ImportDialog } from "./importdialog";

export class CurrentRepertoireImporter {
  private importDialog_: ImportDialog;
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private renameInput_: RenameInput;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

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
  }

  startPgnImport(pgn: string): void {
    PgnImporter
        .startPgnImport(pgn)
        .getCompletionPromise()
        .then(repertoire => {
          this.importDialog_.hide();
          this.treeModel_.loadRepertoire(repertoire);
          this.treeView_.refresh();
          this.renameInput_.refresh();

          this.updater_.updateCurrentRepertoire().then(
              () => this.pickerController_.updatePicker());
        });
  }
}