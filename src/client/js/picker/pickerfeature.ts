import { PickerController } from './pickercontroller';
import { PickerModel } from './pickermodel';
import { PickerView } from './pickerview';

export class PickerFeature {
  static install(controller: PickerController): void {
    const pickerElement = document.getElementById('picker');
    const addMetadataElement = document.getElementById('addMetadata');
    if (!pickerElement || !addMetadataElement) {
      throw new Error('Couldn\'t find necessary DOM elements for picker.');
    }

    const model = new PickerModel();
    const view = new PickerView(
        model, controller, pickerElement, addMetadataElement);

    controller.initialize(model, view);
  }
}