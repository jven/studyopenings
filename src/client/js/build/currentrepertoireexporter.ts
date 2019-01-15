import { getUtcDate, getUtcTime } from '../../../util/datetime';
import { TreeModel } from '../tree/treemodel';

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
      'UTCDate': getUtcDate(now),
      'UTCTime': getUtcTime(now),
      'Result': '*'
    };
  }

  private getExportFilename_(now: Date): string {
    const name = this.treeModel_.getRepertoireName();
    const formattedName = name.toLocaleLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]+/g, '')
        .replace(/\s+/g, '-');
    const utcDate = getUtcDate(now);

    return `studyopenings_${formattedName}_${utcDate}.pgn`;
  }
}