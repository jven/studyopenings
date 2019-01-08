import { TreeModel } from "../tree/treemodel";
import { PickerController } from "../picker/pickercontroller";

export class CurrentRepertoireExporter {
  private treeModel_: TreeModel;

  constructor(treeModel: TreeModel) {
    this.treeModel_ = treeModel;
  }

  exportCurrentRepertoire(): void {
    const linkEl = document.createElement('a');
    linkEl.style.display = 'none';

    var pgn = this.treeModel_.exportToPgn();
    linkEl.download = this.getExportFilename_();
    linkEl.href = `data:application/x-chess-pgn,${this.getExportContents_()}`;

    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  }

  private getExportContents_(): string {
    const tags = this.getExportTags_();
    let tagsString = '';
    for (const key in tags) {
      tagsString += `[${key} "${tags[key]}"]\n`
    }

    const moves = this.treeModel_.exportToPgn();
    return encodeURIComponent(`${tagsString}\n${moves}`);
  }

  private getExportTags_(): {[key: string]: string} {
    return {
      'Event': this.treeModel_.getRepertoireName(),
      'Site': 'http://studyopenings.com',
      'Result': '*'
    };
  }

  private getExportFilename_(): string {
    const name = this.treeModel_.getRepertoireName();
    const formattedName = name.toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]+/g, '')
        .replace(/\s+/g, '-');

    return `studyopenings-${formattedName}.pgn`;
  }
}