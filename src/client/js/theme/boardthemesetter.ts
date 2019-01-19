import { BoardTheme } from '../../../protocol/boardtheme';

const CLASS_MAP: Map<BoardTheme, string> = new Map();
CLASS_MAP.set(BoardTheme.BLUE, 'blue-theme')
    .set(BoardTheme.GREEN, 'green-theme')
    .set(BoardTheme.BROWN, 'brown-theme')
    .set(BoardTheme.PURPLE, 'purple-theme');

export class BoardThemeSetter {
  private boardElements_: HTMLElement[];

  constructor(boardElements: HTMLElement[]) {
    this.boardElements_ = boardElements;
  }

  set(newBoardTheme: BoardTheme): void {
    this.boardElements_.forEach(el => {
      CLASS_MAP.forEach((cssClass, boardTheme) => {
        el.classList.toggle(cssClass, boardTheme == newBoardTheme);
      });
    });
  }
}
