import { Annotator } from './annotator';

export class NullAnnotator implements Annotator<null> {
  annotate(): Promise<null> {
    return Promise.resolve(null);
  }

  static INSTANCE: Annotator<null> = new NullAnnotator();
}
