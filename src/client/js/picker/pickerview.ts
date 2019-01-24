import { FlagName } from '../../../flag/flags';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { Metadata } from '../../../protocol/storage';
import { ConfirmDeleteDialog } from './confirmdeletedialog';
import { PickerController } from './pickercontroller';
import { PickerModel } from './pickermodel';

const MAX_REPERTOIRES_PER_USER = 20;

enum CssClasses {
  DELETE_BUTTON = 'deleteButton',
  HOVER_BUTTON = 'hoverButton',
  METADATA = 'metadata',
  SELECTED_METADATA = 'selected'
}

export class PickerView {
  private flags_: EvaluatedFlags;
  private pickerModel_: PickerModel;
  private pickerController_: PickerController;
  private confirmDeleteDialog_: ConfirmDeleteDialog;
  private pickerElement_: HTMLElement;
  private addMetadataElement_: HTMLElement;

  constructor(
      flags: EvaluatedFlags,
      pickerModel: PickerModel,
      pickerController: PickerController,
      confirmDeleteDialog: ConfirmDeleteDialog,
      pickerElement: HTMLElement,
      addMetadataElement: HTMLElement) {
    this.flags_ = flags;
    this.pickerModel_ = pickerModel;
    this.pickerController_ = pickerController;
    this.confirmDeleteDialog_ = confirmDeleteDialog;
    this.pickerElement_ = pickerElement;
    this.addMetadataElement_ = addMetadataElement;

    this.addMetadataElement_.onclick
        = () => this.pickerController_.addMetadata();
  }

  refresh() {
    // Remove all metadata children of the picker.
    const metadataChildren = document.querySelectorAll(
        '#picker > div.metadata');
    for (let i = 0; i < metadataChildren.length; i++) {
      this.pickerElement_.removeChild(metadataChildren.item(i));
    }

    // Insert the new metadata children before the add metadata button.
    const metadataList = this.pickerModel_.getMetadataList();
    const selectedIndex = this.pickerModel_.getSelectedIndex();
    for (let j = 0; j < metadataList.length; j++) {
      const newChild = this.createMetadataElement_(
          metadataList[j], j == selectedIndex /* isSelected */);
      this.pickerElement_.insertBefore(newChild, this.addMetadataElement_);
    }

    // Hide the add metadata button if the user has the maximum number of
    // repertoires.
    const hideAddMetadataButton =
        metadataList.length >= MAX_REPERTOIRES_PER_USER;
    this.addMetadataElement_.classList.toggle('hidden', hideAddMetadataButton);
  }

  private createMetadataElement_(
      metadata: Metadata, isSelected: boolean): HTMLElement {
    const newElement = document.createElement('div');
    newElement.classList.add(CssClasses.METADATA);
    if (isSelected) {
      newElement.classList.add(CssClasses.SELECTED_METADATA);
    }

    const label = document.createElement('div');
    label.classList.add('metadataName');
    label.innerText = metadata.name;

    const deleteButton = document.createElement('div');
    deleteButton.onclick = (e) => this.handleDeleteButton_(
        e, metadata.id, metadata.name);

    deleteButton.classList.add(
        CssClasses.HOVER_BUTTON, CssClasses.DELETE_BUTTON);

    newElement.append(label, deleteButton);

    newElement.onclick = () =>
        this.pickerController_.selectMetadataId(metadata.id);
    return newElement;
  }

  private handleDeleteButton_(
      e: MouseEvent, metadataId: string, metadataName: string): void {
    if (!this.flags_[FlagName.ENABLE_PICKER_DELETE_CONFIRM]) {
      this.pickerController_.deleteMetadataId(metadataId);
    } else {
      this.confirmDeleteDialog_.showForRepertoire(metadataId, metadataName);
    }

    // The click should not propagate to the parent metadata element since doing
    // so would cause the repertoire being deleted to also be loaded.
    e.stopPropagation();
  }
}
