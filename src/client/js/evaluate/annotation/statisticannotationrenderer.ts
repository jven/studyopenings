import { AnnotationRenderer } from '../../annotation/annotationrenderer';
import { StatisticAnnotation } from './statisticannotation';

export class StatisticAnnotationRenderer implements
    AnnotationRenderer<StatisticAnnotation> {
  renderAnnotation(
      annotation: StatisticAnnotation, treeNodeElement: HTMLElement): void {
    const totalCount = annotation.rightMoveCount + annotation.wrongMoveCount;
    if (!totalCount) {
      return;
    }

    const rightRatio = annotation.rightMoveCount / totalCount;
    const rightRed = 155;
    const rightGreen = 199;
    const wrongRed = 255;
    const wrongGreen = 0;
    const red = Math.floor(
        rightRatio * rightRed + (1 - rightRatio) * wrongRed);
    const green = Math.floor(
        rightRatio * rightGreen + (1 - rightRatio) * wrongGreen);
    const color = `rgba(${red}, ${green}, 0, 0.8)`;

    treeNodeElement.style.backgroundColor = color;
  }
}
