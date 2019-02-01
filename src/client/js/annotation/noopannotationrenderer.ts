import { AnnotationRenderer } from './annotationrenderer';

export class NoOpAnnotationRenderer implements AnnotationRenderer<null> {
  renderAnnotation(): void {}
}
