import { Annotation } from './annotation';
import { Annotator } from './annotator';

export class NullAnnotator implements Annotator {
  annotate(): Annotation | null {
    return null;
  }

  static INSTANCE: Annotator = new NullAnnotator();
}