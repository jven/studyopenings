declare var tippy: any;

export class Tooltips {
  static addTo(elements: Element[]) {
    elements.forEach(e => Tooltips.addTo_(e));
  }

  private static addTo_(element: Element) {
    tippy(element, {
      a11y: false,
      arrow: true,
      delay: [10, 20],
      animation: 'shift-away'
    });
  }

  static hideAll() {
    tippy.hideAllPoppers();
  }
}
