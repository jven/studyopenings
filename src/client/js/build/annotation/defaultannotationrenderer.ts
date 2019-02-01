import { assert } from '../../../../util/assert';
import { AnnotationRenderer } from '../../annotation/annotationrenderer';
import { BuildAnnotation } from './buildannotation';
import { DisplayType } from './displaytype';

declare let tippy: any;

enum Classes {
  TRANSPOSITION_NODE = 'transpositionNode',
  WARNING_NODE = 'warningNode'
}

export class DefaultAnnotationRenderer
    implements AnnotationRenderer<BuildAnnotation | null> {
  renderAnnotation(
      annotation: BuildAnnotation | null,
      cell: HTMLElement): void {
    if (!annotation) {
      return;
    }
    if (annotation.displayType == DisplayType.WARNING) {
      // Indicate warnings.
      cell.classList.add(Classes.WARNING_NODE);
      const template = assert(
          document.getElementById('warningTooltipContentTemplate'));
      tippy(cell, {
        a11y: false,
        animateFill: false,
        animation: 'fade',
        content() {
          const content = document.createElement('div');
          content.innerHTML = template.innerHTML;
          const contentList =
              assert(content.querySelector('.warningTooltipContent-list'));
          const newElement = document.createElement('li');
          newElement.innerHTML = annotation.content;
          contentList.appendChild(newElement);
          return content;
        },
        delay: 0,
        duration: 0,
        placement: 'bottom',
        theme: 'warningTooltip'
      });
    } else if (annotation.displayType == DisplayType.INFORMATIONAL) {
      // Indicate transposition.
      cell.classList.add(Classes.TRANSPOSITION_NODE);
      const template = assert(document.getElementById(
          'transpositionTooltipContentTemplate'));
      tippy(cell, {
        a11y: false,
        animateFill: false,
        animation: 'fade',
        content() {
          const content = document.createElement('div');
          content.innerHTML = template.innerHTML;
          assert(content.querySelector('.transpositionTooltipContent-title'))
              .innerHTML = assert(annotation).title;
          assert(content.querySelector('.transpositionTooltipContent-body'))
              .innerHTML = assert(annotation).content;
          return content;
        },
        delay: 0,
        duration: 0,
        placement: 'bottom',
        theme: 'transpositionTooltip'
      });
    }
  }
}
