import { MetadataJson } from '../../../protocol/protocol';

export class PickerModel {
  private metadataList_: MetadataJson[];
  private selectedIndex_: number;

  constructor() {
    this.metadataList_ = [];
    this.selectedIndex_ = -1;
  }

  setMetadataList(
      metadataList: MetadataJson[],
      selectedMetadataId: string | null): void {
    this.metadataList_ = metadataList;
    this.selectMetadataId(selectedMetadataId);
  }

  selectMetadataId(metadataId: string | null): void {
    if (metadataId) {
      const metadataIndex
          = this.metadataList_.findIndex(m => m.id == metadataId);
      if (metadataIndex >= 0) {
        this.selectedIndex_ = metadataIndex;
        return;
      }
    }
    this.selectedIndex_ = 0;
  }

  getMetadataList(): MetadataJson[] {
    return this.metadataList_;
  }

  getSelectedMetadata(): MetadataJson {
    if (this.selectedIndex_ == -1) {
      throw new Error('No metadata selected yet.');
    }
    return this.metadataList_[this.selectedIndex_];
  }

  getSelectedIndex(): number {
    if (this.selectedIndex_ == -1) {
      throw new Error('No metadata selected yet.');
    }
    return this.selectedIndex_;
  }
}