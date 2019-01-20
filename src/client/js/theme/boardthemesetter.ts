import { BoardTheme } from '../../../protocol/boardtheme';
import { BoardThemeButtons } from './boardthemebuttons';

const SET_THEME_MAP: Map<BoardTheme, string> = new Map();
SET_THEME_MAP
    .set(BoardTheme.BLUE, 'blue-theme')
    .set(BoardTheme.GREEN, 'green-theme')
    .set(BoardTheme.BROWN, 'brown-theme')
    .set(BoardTheme.PURPLE, 'purple-theme');

const PREVIEW_THEME_MAP: Map<BoardTheme, string> = new Map();
PREVIEW_THEME_MAP
    .set(BoardTheme.BLUE, 'blue-theme-preview')
    .set(BoardTheme.GREEN, 'green-theme-preview')
    .set(BoardTheme.BROWN, 'brown-theme-preview')
    .set(BoardTheme.PURPLE, 'purple-theme-preview');

export class BoardThemeSetter {
  private boardElements_: HTMLElement[];
  private boardThemeButtons_: BoardThemeButtons;

  constructor(
      boardElements: HTMLElement[],
      boardThemeButtons: BoardThemeButtons) {
    this.boardElements_ = boardElements;
    this.boardThemeButtons_ = boardThemeButtons;
  }

  set(newBoardTheme: BoardTheme): void {
    this.toggleCssClassForMap_(
        SET_THEME_MAP,
        boardTheme => boardTheme == newBoardTheme);
    this.boardThemeButtons_.forEach((buttonEl, boardTheme) => {
      buttonEl.classList.toggle(
          'selectedBoardTheme', boardTheme == newBoardTheme);
    });
  }

  preview(newBoardTheme: BoardTheme): void {
    this.toggleCssClassForMap_(
        PREVIEW_THEME_MAP,
        boardTheme => boardTheme == newBoardTheme);
  }

  endPreview(): void {
    this.toggleCssClassForMap_(
        PREVIEW_THEME_MAP,
        () => false);
  }

  private toggleCssClassForMap_(
      map: Map<BoardTheme, string>,
      filter: (boardTheme: BoardTheme) => boolean): void {
    this.boardElements_.forEach(el => {
      map.forEach((cssClass, boardTheme) => {
        el.classList.toggle(cssClass, filter(boardTheme));
      });
    });
  }
}
