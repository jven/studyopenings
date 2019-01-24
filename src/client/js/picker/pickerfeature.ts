import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { assert } from '../../../util/assert';
import { ConfirmDeleteDialog } from './confirmdeletedialog';
import { PickerController } from './pickercontroller';
import { PickerModel } from './pickermodel';
import { PickerView } from './pickerview';

export class PickerFeature {
  static install(
      flags: EvaluatedFlags,
      controller: PickerController,
      confirmDeleteDialog: ConfirmDeleteDialog): void {
    const pickerElement = assert(document.getElementById('picker'));
    const addMetadataElement = assert(document.getElementById('addMetadata'));

    const model = new PickerModel();
    const view = new PickerView(
        flags,
        model,
        controller,
        confirmDeleteDialog,
        pickerElement,
        addMetadataElement);

    controller.initialize(model, view);
  }
}
