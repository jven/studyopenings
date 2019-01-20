import { SoundValue } from '../../../protocol/soundvalue';
import { PreferenceSaver } from '../preferences/preferencesaver';

export class SoundToggler {
  private preferenceSaver_: PreferenceSaver;
  private soundOnEl_: HTMLElement;
  private soundOffEl_: HTMLElement;
  private soundsEnabled_: boolean;

  constructor(
      preferenceSaver: PreferenceSaver,
      soundTogglerEl: HTMLElement,
      soundOnEl: HTMLElement,
      soundOffEl: HTMLElement) {
    this.preferenceSaver_ = preferenceSaver;
    this.soundOnEl_ = soundOnEl;
    this.soundOffEl_ = soundOffEl;
    this.soundsEnabled_ = true;

    this.refreshEls_();

    soundTogglerEl.onclick = () => this.toggle();
  }

  areSoundsEnabled(): boolean {
    return this.soundsEnabled_;
  }

  setSoundsEnabled(soundsEnabled: boolean): void {
    this.setSoundsEnabledAndMaybeSetPreference_(
        soundsEnabled, false /* setPreference */);
  }

  toggle(): void {
    this.setSoundsEnabledAndMaybeSetPreference_(
        !this.soundsEnabled_, true /* setPreference */);
  }

  private setSoundsEnabledAndMaybeSetPreference_(
      soundsEnabled: boolean, setPreference: boolean): void {
    this.soundsEnabled_ = soundsEnabled;
    this.refreshEls_();

    if (setPreference) {
      this.preferenceSaver_.save({
        soundValue: soundsEnabled ? SoundValue.ON : SoundValue.OFF
      });
    }
  }

  private refreshEls_(): void {
    this.soundOnEl_.classList.toggle('hidden', !this.soundsEnabled_);
    this.soundOffEl_.classList.toggle('hidden', this.soundsEnabled_);
  }
}
