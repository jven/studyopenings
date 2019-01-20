import { BoardTheme } from '../../../protocol/boardtheme';
import { PreferenceSaver } from '../preferences/preferencesaver';
import { BoardThemeSetter } from './boardthemesetter';

export class ThemePalette {
  private boardThemeSetter_: BoardThemeSetter;
  private preferenceSaver_: PreferenceSaver;
  private themeTogglerEl_: HTMLElement;

  constructor(
      boardThemeSetter: BoardThemeSetter,
      preferenceSaver: PreferenceSaver,
      themeTogglerEl: HTMLElement) {
    this.boardThemeSetter_ = boardThemeSetter;
    this.preferenceSaver_ = preferenceSaver;
    this.themeTogglerEl_ = themeTogglerEl;
  }

  handlePaletteClicks(): void {
    this.themeTogglerEl_.onclick = () => this.setBoardTheme_(BoardTheme.GREEN);
  }

  private setBoardTheme_(boardTheme: BoardTheme): void {
    this.boardThemeSetter_.set(boardTheme);
    this.preferenceSaver_.save({boardTheme});
  }
}
