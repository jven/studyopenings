import { TreeModel } from "../tree/treemodel";
import { PickerController } from "../picker/pickercontroller";

export class CurrentRepertoireExporter {
  private treeModel_: TreeModel;

  constructor(treeModel: TreeModel) {
    this.treeModel_ = treeModel;
  }

  exportCurrentRepertoire(): void {
    const now = new Date();
    const linkEl = document.createElement('a');
    linkEl.style.display = 'none';

    var pgn = this.treeModel_.exportToPgn();
    linkEl.download = this.getExportFilename_(now);
    
    const contents = this.getExportContents_(now);
    linkEl.href = `data:application/x-chess-pgn,${contents}`;

    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  }

  private getExportContents_(now: Date): string {
    const tags = this.getExportTags_(now);
    let tagsString = '';
    for (const key in tags) {
      tagsString += `[${key} "${tags[key]}"]\n`
    }

    const moves = this.treeModel_.exportToPgn();
    return encodeURIComponent(`${tagsString}\n${moves}`);
  }

  private getExportTags_(now: Date): {[key: string]: string} {
    return {
      'Event': this.treeModel_.getRepertoireName(),
      'Site': 'http://studyopenings.com',
      'UTCDate': this.getUtcDate_(now),
      'UTCTime': this.getUtcTime_(now),
      'Result': '*'
    };
  }

  private getExportFilename_(now: Date): string {
    const name = this.treeModel_.getRepertoireName();
    const formattedName = name.toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]+/g, '')
        .replace(/\s+/g, '-');
    const utcDate = this.getUtcDate_(now);

    return `studyopenings_${formattedName}_${utcDate}.pgn`;
  }

  private getUtcDate_(now: Date): string {
    const year = this.zeroFill_(now.getUTCFullYear(), 4);
    const month = this.zeroFill_(now.getUTCMonth() + 1, 2);
    const day = this.zeroFill_(now.getUTCDate(), 2);
    return `${year}.${month}.${day}`;
  }

  private getUtcTime_(now: Date): string {
    const hour = this.zeroFill_(now.getUTCHours(), 2);
    const minutes = this.zeroFill_(now.getUTCMinutes(), 2);
    const seconds = this.zeroFill_(now.getUTCSeconds(), 2);
    return `${hour}:${minutes}:${seconds}`;
  }

  private zeroFill_(n: number, numDigits: number): string {
    let ans = n.toString();
    for (let i = 0; i < numDigits - ans.length; i++) {
      ans = '0' + ans;
    }
    return ans;
  }
}