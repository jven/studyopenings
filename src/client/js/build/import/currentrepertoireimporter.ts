import { TreeModel } from "../../tree/treemodel";
import { CurrentRepertoireUpdater } from "../currentrepertoireupdater";
import { TreeView } from "../treeview";
import { PgnImporter } from "./pgnimporter";
import { RenameInput } from "../renameinput";
import { PickerController } from "../../picker/pickercontroller";

export class CurrentRepertoireImporter {
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private renameInput_: RenameInput;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      treeModel: TreeModel,
      treeView: TreeView,
      renameInput: RenameInput,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.renameInput_ = renameInput;
    this.pickerController_ = pickerController;
    this.updater_ = updater;
  }

  importPgn(pgn: string): void {
    PgnImporter
        .importPgn(pgn)
        .getCompletionPromise()
        .then(repertoire => {
          this.treeModel_.loadRepertoire(repertoire);
          this.treeView_.refresh();
          this.renameInput_.refresh();

          this.updater_.updateCurrentRepertoire().then(
              () => this.pickerController_.updatePicker());
        });
  }
}