import { BoardTheme } from '../../../protocol/boardtheme';
import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../impressions/impressionsender';
import { PreferenceSaver } from '../preferences/preferencesaver';
import { BoardThemeInfoMap } from './boardthemeinfo';
import { BoardThemeSetter } from './boardthemesetter';

declare var tippy: any;

export class ThemePalette {
  private impressionSender_: ImpressionSender;
  private boardThemeSetter_: BoardThemeSetter;
  private preferenceSaver_: PreferenceSaver;

  constructor(
      impressionSender: ImpressionSender,
      boardThemeSetter: BoardThemeSetter,
      preferenceSaver: PreferenceSaver) {
    this.impressionSender_ = impressionSender;
    this.boardThemeSetter_ = boardThemeSetter;
    this.preferenceSaver_ = preferenceSaver;
  }

  initializePalette(
      themePaletteEl: HTMLElement,
      themePaletteTooltipContentEl: HTMLElement,
      boardThemeInfoMap: BoardThemeInfoMap): void {
    boardThemeInfoMap.forEach(
        (info, boardTheme) => this.bindTheme_(info.buttonEl, boardTheme));

    tippy(
        themePaletteEl,
        {
          a11y: false,
          content: themePaletteTooltipContentEl,
          delay: 0,
          duration: 0,
          interactive: true,
          theme: 'themePaletteTooltip',
          trigger: 'mouseenter click'
        });
    themePaletteTooltipContentEl.classList.remove('hidden');
  }

  private bindTheme_(buttonEl: HTMLElement, boardTheme: BoardTheme): void {
    buttonEl.onclick = () => {
      this.impressionSender_.sendImpression(
          ImpressionCode.SET_BOARD_THEME,
          {boardTheme});
      this.boardThemeSetter_.set(boardTheme);
      this.preferenceSaver_.save({boardTheme});
    };

    buttonEl.onmouseenter = () => {
      this.boardThemeSetter_.preview(boardTheme);
    };

    buttonEl.onmouseleave = () => {
      this.boardThemeSetter_.endPreview();
    };
  }
}
