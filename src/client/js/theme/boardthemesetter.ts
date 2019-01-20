import { BoardTheme } from '../../../protocol/boardtheme';

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

  constructor(boardElements: HTMLElement[]) {
    this.boardElements_ = boardElements;
  }

  set(newBoardTheme: BoardTheme): void {
    this.forMap_(
        SET_THEME_MAP,
        boardTheme => boardTheme == newBoardTheme);
  }

  preview(newBoardTheme: BoardTheme): void {
    this.forMap_(
        PREVIEW_THEME_MAP,
        boardTheme => boardTheme == newBoardTheme);
  }

  endPreview(): void {
    this.forMap_(
        PREVIEW_THEME_MAP,
        boardTheme => false);
  }

  private forMap_(
      map: Map<BoardTheme, string>,
      filter: (boardTheme: BoardTheme) => boolean): void {
    this.boardElements_.forEach(el => {
      map.forEach((cssClass, boardTheme) => {
        el.classList.toggle(cssClass, filter(boardTheme));
      });
    });
  }
}
