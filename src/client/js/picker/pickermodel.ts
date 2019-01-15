import { Metadata } from '../../../protocol/storage';

export class PickerModel {
  private metadataList_: Metadata[];
  private selectedIndex_: number;

  constructor() {
    this.metadataList_ = [];
    this.selectedIndex_ = -1;
  }

  isEmpty(): boolean {
    return !this.metadataList_.length;
  }

  setMetadataList(
      metadataList: Metadata[],
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

  getMetadataList(): Metadata[] {
    return this.metadataList_;
  }

  getSelectedMetadata(): Metadata {
    return this.metadataList_[this.getSelectedIndex()];
  }

  getSelectedIndex(): number {
    if (this.selectedIndex_ == -1) {
      throw new Error('No metadata selected yet.');
    }
    return this.selectedIndex_;
  }
}
