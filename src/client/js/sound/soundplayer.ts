import { Howl } from 'howler';
import { SoundToggler } from './soundtoggler';

export class SoundPlayer {
  private soundToggler_: SoundToggler;

  constructor(soundToggler: SoundToggler) {
    this.soundToggler_ = soundToggler;
  }

  playMove(): void {
    if (!this.soundToggler_.areSoundsEnabled()) {
      return;
    }

    new Howl({
      src: ['ogg/move.ogg'],
      autoplay: true
    });
  }

  playCapture(): void {
    if (!this.soundToggler_.areSoundsEnabled()) {
      return;
    }

    new Howl({
      src: ['ogg/capture.ogg'],
      autoplay: true
    });
  }
}
