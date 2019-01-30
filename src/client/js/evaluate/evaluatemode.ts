import { assert } from '../../../util/assert';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { SoundToggler } from '../sound/soundtoggler';

export class EvaluateMode implements Mode {
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private evaluateModeElement_: HTMLElement;
  private evaluateButton_: HTMLElement;

  constructor(
      modeManager: ModeManager,
      soundToggler: SoundToggler) {
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;

    this.evaluateModeElement_ = assert(document.getElementById('evaluateMode'));
    this.evaluateButton_ = assert(document.getElementById('evaluateButton'));
    this.evaluateButton_.onclick = () => this.modeManager_.selectModeType(
        ModeType.EVALUATE);
  }

  preEnter(): Promise<void> {
    return Promise.resolve();
  }

  exit(): Promise<void> {
    this.toggleEvaluteUi_(false);
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.toggleEvaluteUi_(true);
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
    } else if (e.keyCode == 66) {
      this.modeManager_.selectModeType(ModeType.BUILD); // B
    } else if (e.keyCode == 77) {
      this.soundToggler_.toggle(); // M
    }
  }

  notifySelectedMetadata(): Promise<void> {
    return Promise.resolve();
  }

  private toggleEvaluteUi_(enable: boolean): void {
    this.evaluateModeElement_.classList.toggle('hidden', !enable);
    this.evaluateButton_.classList.toggle('selectedMode', enable);
  }
}
