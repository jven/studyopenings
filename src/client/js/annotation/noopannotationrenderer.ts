import { AnnotationRenderer } from './annotationrenderer';

export class NoOpAnnotationRenderer implements AnnotationRenderer {
  renderAnnotation(): void {}
}
