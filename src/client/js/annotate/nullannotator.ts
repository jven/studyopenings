import { Annotator } from "./annotator";
import { Annotation } from "./annotation";

export class NullAnnotator implements Annotator {
  annotate(): Annotation | null {
    return null;
  }

  static INSTANCE: Annotator = new NullAnnotator();
}