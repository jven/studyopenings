import { Mode } from './mode';

export class ModeManager {
  private modes_: Map<string, Mode>;
  private selectedModeType_: string | null;

  constructor() {
    this.modes_ = new Map<string, Mode>();
    this.selectedModeType_ = null;
  }

  registerMode(modeType: string, mode: Mode): ModeManager {
    if (this.modes_.has(modeType)) {
      throw new Error('Mode type registered twice!');
    }
    this.modes_.set(modeType, mode);
    return this;
  }

  selectModeType(modeType: string): Promise<void> {
    if (modeType == this.selectedModeType_) {
      // This mode is already selected.
      return Promise.resolve();
    }

    const newMode = this.mode_(modeType);
    return newMode.preEnter()
        .then(() => this.selectedModeType_
            ? this.mode_(this.selectedModeType_).exit()
            : Promise.resolve())
        .then(() => newMode.postEnter())
        .then(() => {
          this.selectedModeType_ = modeType;
        });
  }

  getSelectedMode(): Mode {
    if (!this.selectedModeType_) {
      throw new Error('No mode selected yet.');
    }

    return this.mode_(this.selectedModeType_);
  }

  private mode_(modeType: string): Mode {
    const mode = this.modes_.get(modeType);
    if (!mode) {
      throw new Error('Unregistered mode type: ' + modeType);
    }
    return mode;
  }
}
