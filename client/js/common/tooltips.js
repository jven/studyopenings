class Tooltips {
  static addTo(elements) {
    elements.forEach(e => Tooltips.addTo_(e));
  }

  static addTo_(element) {
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