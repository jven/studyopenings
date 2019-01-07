import { TreeModel } from "../tree/treemodel";

export class CurrentRepertoireExporter {
  private treeModel_: TreeModel;

  constructor(treeModel: TreeModel) {
    this.treeModel_ = treeModel;
  }

  exportCurrentRepertoire(): void {
    const linkEl = document.createElement('a');
    linkEl.style.display = 'none';

    var pgn = '1. e4 e5 2. Nf3 Nc6\n1. d4 d5';
    linkEl.download = 'repertoire.pgn';
    linkEl.href = 'data:application/x-chess-pgn,' + encodeURIComponent(pgn);

    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  }
}