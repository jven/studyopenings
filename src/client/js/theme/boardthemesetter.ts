import { BoardTheme } from '../../../protocol/boardtheme';
import { BoardThemeInfo, BoardThemeInfoMap } from './boardthemeinfo';

export class BoardThemeSetter {
  private boardElements_: HTMLElement[];
  private boardThemeInfoMap_: BoardThemeInfoMap;

  constructor(
      boardElements: HTMLElement[],
      boardThemeInfoMap: BoardThemeInfoMap) {
    this.boardElements_ = boardElements;
    this.boardThemeInfoMap_ = boardThemeInfoMap;
  }

  set(newBoardTheme: BoardTheme): void {
    this.toggleCssForBoards_(
        info => info.setCssClass,
        boardTheme => boardTheme == newBoardTheme);

    this.boardThemeInfoMap_.forEach((info, boardTheme) => {
      info.buttonEl.classList.toggle(
          'selectedBoardTheme', boardTheme == newBoardTheme);
    });
  }

  preview(newBoardTheme: BoardTheme): void {
    this.toggleCssForBoards_(
        info => info.previewCssClass,
        boardTheme => boardTheme == newBoardTheme);
  }

  endPreview(): void {
    this.toggleCssForBoards_(
        info => info.previewCssClass,
        () => false);
  }

  private toggleCssForBoards_(
      cssClassFn: (info: BoardThemeInfo) => string,
      filterFn: (boardTheme: BoardTheme) => boolean): void {
    this.boardElements_.forEach(boardEl => {
      this.boardThemeInfoMap_.forEach((info, boardTheme) => {
        boardEl.classList.toggle(cssClassFn(info), filterFn(boardTheme));
      });
    });
  }
}
