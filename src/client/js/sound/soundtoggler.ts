export class SoundToggler {
  private soundOnEl_: HTMLElement;
  private soundOffEl_: HTMLElement;
  private soundsEnabled_: boolean;

  constructor(
      soundTogglerEl: HTMLElement,
      soundOnEl: HTMLElement,
      soundOffEl: HTMLElement) {
    this.soundOnEl_ = soundOnEl;
    this.soundOffEl_ = soundOffEl;
    this.soundsEnabled_ = true;

    this.refreshEls_();

    soundTogglerEl.onclick = () => this.toggle();
  }

  areSoundsEnabled(): boolean {
    return this.soundsEnabled_;
  }

  toggle(): void {
    this.soundsEnabled_ = !this.soundsEnabled_;
    this.refreshEls_();
  }

  private refreshEls_(): void {
    this.soundOnEl_.classList.toggle('hidden', !this.soundsEnabled_);
    this.soundOffEl_.classList.toggle('hidden', this.soundsEnabled_);
  }
}
