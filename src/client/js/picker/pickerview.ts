import { PickerModel } from './pickermodel';
import { Metadata } from '../../../protocol/storage';
import { PickerController } from './pickercontroller';

enum Class_ {
  DELETE_BUTTON = 'deleteButton',
  HOVER_BUTTON = 'hoverButton',
  METADATA = 'metadata',
  SELECTED_METADATA = 'selected'
}

export class PickerView {
  private pickerModel_: PickerModel;
  private pickerController_: PickerController;
  private pickerElement_: HTMLElement;
  private addMetadataElement_: HTMLElement;

  constructor(
      pickerModel: PickerModel,
      pickerController: PickerController,
      pickerElement: HTMLElement,
      addMetadataElement: HTMLElement) {
    this.pickerModel_ = pickerModel;
    this.pickerController_ = pickerController;
    this.pickerElement_ = pickerElement;
    this.addMetadataElement_ = addMetadataElement;

    this.addMetadataElement_.onclick
        = () => this.pickerController_.addMetadata();
  }

  refresh() {
    // Remove all metadata children of the picker.
    const metadataChildren = document.querySelectorAll(
        '#picker > div.metadata');
    for (var i = 0; i < metadataChildren.length; i++) {
      this.pickerElement_.removeChild(metadataChildren.item(i));
    }

    // Insert the new metadata children before the add metadata button.
    const metadata = this.pickerModel_.getMetadataList();
    const selectedIndex = this.pickerModel_.getSelectedIndex();
    for (var i = 0; i < metadata.length; i++) {
      const newChild = this.createMetadataElement_(
          metadata[i], i == selectedIndex /* isSelected */);
      this.pickerElement_.insertBefore(newChild, this.addMetadataElement_);
    }
  }

  private createMetadataElement_(
      metadata: Metadata, isSelected: boolean): HTMLElement {
    const newElement = document.createElement('div');
    newElement.classList.add(Class_.METADATA);
    if (isSelected) {
      newElement.classList.add(Class_.SELECTED_METADATA);
    }

    const label = document.createElement('div');
    label.classList.add('metadataName');
    label.innerText = metadata.name;

    const deleteButton = document.createElement('div');
    deleteButton.onclick = (e) => this.handleDeleteButton_(e, metadata.id);

    deleteButton.classList.add(Class_.HOVER_BUTTON, Class_.DELETE_BUTTON);

    newElement.append(label, deleteButton);

    newElement.onclick = () =>
        this.pickerController_.selectMetadataId(metadata.id);
    return newElement;
  }

  private handleDeleteButton_(e: MouseEvent, metadataId: string): void {
    this.pickerController_.deleteMetadataId(metadataId);
    // The click should not propagate to the parent metadata element since doing
    // so would cause the repertoire being deleted to also be loaded.
    e.stopPropagation();
  }
}