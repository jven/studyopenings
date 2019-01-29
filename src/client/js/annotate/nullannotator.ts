import { Annotation } from './annotation';
import { Annotator } from './annotator';

export class NullAnnotator implements Annotator {
  annotate(): Promise<Annotation | null> {
    return Promise.resolve(null);
  }

  static INSTANCE: Annotator = new NullAnnotator();
}
