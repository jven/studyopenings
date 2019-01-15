import { Howl } from 'howler';
import { SoundToggler } from './soundtoggler';

export class SoundPlayer {
  private soundToggler_: SoundToggler;

  constructor(soundToggler: SoundToggler) {
    this.soundToggler_ = soundToggler;
  }

  playMove(): void {
    this.play_('move');
  }

  playCapture(): void {
    this.play_('capture');
  }

  playWrongMove(): void {
    this.play_('wrongMove');
  }

  playFinishLine(): void {
    this.play_('finishLine');
  }

  private play_(soundName: string): void {
    if (!this.soundToggler_.areSoundsEnabled()) {
      return;
    }

    new Howl({
      src: [`ogg/${soundName}.ogg`],
      autoplay: true
    });
  }
}
