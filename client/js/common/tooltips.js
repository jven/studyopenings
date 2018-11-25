class Tooltips {
  static addTo(elements) {
    elements.forEach(e => Tooltips.addTo_(e));
  }

  static addTo_(element) {
    element.tabIndex = -1;
    tippy(element, {
      arrow: true,
      delay: 0,
      animation: 'shift-away'
    });
  }
}