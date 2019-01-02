import { PickerClickHandler } from './pickerclickhandler';
import { PickerModel } from './pickermodel';
import { Metadata } from '../../../protocol/storage';

enum Class_ {
  DELETE_BUTTON = 'deleteButton',
  HOVER_BUTTON = 'hoverButton',
  METADATA = 'metadata',
  SELECTED_METADATA = 'selected'
}

export class PickerView {
  private pickerModel_: PickerModel;
  private pickerClickHandler_: PickerClickHandler;
  private pickerElement_: HTMLElement;
  private addMetadataElement_: HTMLElement;

  constructor(
      pickerModel: PickerModel,
      pickerClickHandler: PickerClickHandler,
      pickerElement: HTMLElement,
      addMetadataElement: HTMLElement) {
    this.pickerModel_ = pickerModel;
    this.pickerClickHandler_ = pickerClickHandler;
    this.pickerElement_ = pickerElement;
    this.addMetadataElement_ = addMetadataElement;

    // Bind the add metadata button to the handler.
    this.addMetadataElement_.onclick
        = () => this.pickerClickHandler_.clickAddMetadataButton();
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
    deleteButton.onclick
        = () => this.pickerClickHandler_.clickDeleteButton(metadata.id);

    deleteButton.classList.add(Class_.HOVER_BUTTON, Class_.DELETE_BUTTON);

    newElement.append(label, deleteButton);

    newElement.onclick = () =>
        this.pickerClickHandler_.clickMetadata(metadata.id);
    return newElement;
  }
}