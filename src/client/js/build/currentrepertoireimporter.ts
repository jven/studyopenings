import { TreeModel } from "../tree/treemodel";
import { CurrentRepertoireUpdater } from "./currentrepertoireupdater";
import { TreeView } from "./treeview";
import { PgnImporter } from "./import/pgnimporter";

export class CurrentRepertoireImporter {
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      treeModel: TreeModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater) {
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.updater_ = updater;
  }

  importPgn(pgn: string): void {
    PgnImporter
        .importPgn(pgn)
        .getCompletionPromise()
        .then(repertoire => {
          this.treeModel_.loadRepertoire(repertoire);
          this.treeView_.refresh();
          this.updater_.updateCurrentRepertoire();
        });
  }
}