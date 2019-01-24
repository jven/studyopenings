import { assert } from '../../../util/assert';
import { PrivelegedCopyDialog } from './privelegedcopydialog';

export class PrivelegedFeature {
  static install(
      privelegedCopyDialog: PrivelegedCopyDialog) {
    privelegedCopyDialog.bindButtons(
        assert(document.getElementById('privelegedCopyOk')),
        assert(document.getElementById('privelegedCopyCancel')));

    const copyButton = assert(document.getElementById('privelegedCopyButton'));
    copyButton.classList.remove('hidden');
    copyButton.onclick = () => privelegedCopyDialog.show();
  }
}
