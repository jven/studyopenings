export interface TreeButton {
  buttonEl: HTMLElement,
  handleClick: () => void,
  isEnabled: () => boolean
}
