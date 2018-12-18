import { MetadataJson } from '../../../protocol/protocol';

export class PickerModel {
  private metadataList_: MetadataJson[];
  private selectedIndex_: number;

  constructor() {
    this.metadataList_ = [];
    this.selectedIndex_ = -1;
  }

  setMetadataList(metadataList: MetadataJson[]): void {
    this.metadataList_ = metadataList;
    this.selectedIndex_ = 0;
  }

  getMetadataList(): MetadataJson[] {
    return this.metadataList_;
  }

  getSelectedMetadata(): MetadataJson | null {
    return this.selectedIndex_ >= 0
        ? this.metadataList_[this.selectedIndex_]
        : null;
  }

  getSelectedIndex(): number {
    return this.selectedIndex_;
  }
}