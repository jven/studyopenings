import { Howl } from 'howler';

export class SoundPlayer {
  constructor() {}

  playMove(): void {
    new Howl({
      src: ['ogg/move.ogg'],
      autoplay: true
    });
  }

  playCapture(): void {
    new Howl({
      src: ['ogg/capture.ogg'],
      autoplay: true
    });
  }
}
