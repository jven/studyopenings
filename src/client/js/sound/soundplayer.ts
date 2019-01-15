import { Howl } from 'howler';
import { SoundToggler } from './soundtoggler';

export class SoundPlayer {
  private soundToggler_: SoundToggler;

  constructor(soundToggler: SoundToggler) {
    this.soundToggler_ = soundToggler;
  }

  playMove(): void {
    this.play_('move', 0.4);
  }

  playCapture(): void {
    this.play_('capture', 0.4);
  }

  playWrongMove(): void {
    this.play_('wrongmove', 1);
  }

  playFinishLine(): void {
    this.play_('finishline', 1);
  }

  private play_(soundName: string, volume: number): void {
    if (!this.soundToggler_.areSoundsEnabled()) {
      return;
    }

    new Howl({
      src: [`ogg/${soundName}.ogg`],
      volume: volume,
      autoplay: true
    });
  }
}
