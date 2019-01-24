import { assert } from '../../../util/assert';

export class PrivelegedFeature {
  static install() {
    const copyButton = assert(document.getElementById('privelegedCopyButton'));
    copyButton.classList.remove('hidden');
  }
}
