import { BoardTheme } from '../../../protocol/boardtheme';
import { BoardThemeSetter } from './boardthemesetter';

export class ThemePalette {
  private boardThemeSetter_: BoardThemeSetter;

  constructor(
      boardThemeSetter: BoardThemeSetter,
      themeTogglerEl: HTMLElement) {
    this.boardThemeSetter_ = boardThemeSetter;

    themeTogglerEl.onclick = () => this.boardThemeSetter_.set(BoardTheme.GREEN);
  }
}
