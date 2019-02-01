export interface AnnotationRenderer<ANNOTATION> {
  renderAnnotation(
      annotation: ANNOTATION, treeNodeElement: HTMLElement): void;
}
