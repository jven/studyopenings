import { Mode } from './mode';

export class ModeManager {
  private modes_: Map<string, Mode>;
  private selectedModeType_: string | null;

  constructor() {
    this.modes_ = new Map<string, Mode>();
    this.selectedModeType_ = null;
  }

  registerMode(modeType: string, mode: Mode): ModeManager {
    this.modes_.set(modeType, mode);
    return this;
  }

  selectModeType(modeType: string): Promise<void> {
    if (modeType == this.selectedModeType_) {
      // This mode is already selected.
      return Promise.resolve();
    }

    const newMode = this.modes_.get(modeType);
    if (!newMode) {
      throw new Error('Unknown mode type: ' + modeType);
    }
    return newMode.preEnter()
        .then(() => {
          if (!this.selectedModeType_) {
            return Promise.resolve();
          }
          const oldMode = this.modes_.get(this.selectedModeType_);
          if (!oldMode) {
            throw new Error('Unknown mode type: ' + this.selectedModeType_);
          }
          return oldMode.exit();
        })
        .then(() => newMode.postEnter())
        .then(() => {
          this.selectedModeType_ = modeType;
        });
  }
}