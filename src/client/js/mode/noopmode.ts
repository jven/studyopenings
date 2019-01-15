import { Mode } from './mode';

export class NoOpMode implements Mode {
  preEnter(): Promise<void> {
    return Promise.resolve();
  }
  
  exit(): Promise<void> {
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    return Promise.resolve();
  }
  onKeyDown(e: KeyboardEvent): void {}
  
  notifySelectedMetadata(): Promise<void> {
    return Promise.resolve();
  }
}