import { Howl } from 'howler';

export class Sounds {
  static playMove(): void {
    new Howl({
      src: ['ogg/move.ogg'],
      autoplay: true
    });
  }

  static playCapture(): void {
    new Howl({
      src: ['ogg/capture.ogg'],
      autoplay: true
    });
  }
}
