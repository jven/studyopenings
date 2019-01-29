import { Annotation } from './annotation';

export interface AnnotationRenderer {
  renderAnnotation(annotation: Annotation, treeNodeElement: HTMLElement): void;
}
