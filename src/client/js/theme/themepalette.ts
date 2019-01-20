import { BoardTheme } from '../../../protocol/boardtheme';
import { PreferenceSaver } from '../preferences/preferencesaver';
import { BoardThemeSetter } from './boardthemesetter';

declare var tippy: any;

export class ThemePalette {
  private boardThemeSetter_: BoardThemeSetter;
  private preferenceSaver_: PreferenceSaver;

  constructor(
      boardThemeSetter: BoardThemeSetter,
      preferenceSaver: PreferenceSaver) {
    this.boardThemeSetter_ = boardThemeSetter;
    this.preferenceSaver_ = preferenceSaver;
  }

  initializePalette(
      themePaletteEl: HTMLElement,
      themePaletteTooltipEl: HTMLElement,
      blueButtonEl: HTMLElement,
      greenButtonEl: HTMLElement,
      brownButtonEl: HTMLElement,
      purpleButtonEl: HTMLElement): void {
    blueButtonEl.onclick = () => this.setBoardTheme_(BoardTheme.BLUE);
    greenButtonEl.onclick = () => this.setBoardTheme_(BoardTheme.GREEN);
    brownButtonEl.onclick = () => this.setBoardTheme_(BoardTheme.BROWN);
    purpleButtonEl.onclick = () => this.setBoardTheme_(BoardTheme.PURPLE);

    tippy(
        themePaletteEl,
        {
          a11y: false,
          content: themePaletteTooltipEl,
          delay: 0,
          duration: 0,
          interactive: true,
          trigger: 'mouseenter click'
        });
    themePaletteTooltipEl.classList.remove('hidden');
  }

  private setBoardTheme_(boardTheme: BoardTheme): void {
    this.boardThemeSetter_.set(boardTheme);
    this.preferenceSaver_.save({boardTheme});
  }
}
