import { BoardTheme } from '../../../protocol/boardtheme';
import { assert } from '../../../util/assert';

export interface BoardThemeInfo {
  buttonEl: HTMLElement,
  setCssClass: string,
  previewCssClass: string
}

export type BoardThemeInfoMap = Map<BoardTheme, BoardThemeInfo>;

export function allThemes(): BoardThemeInfoMap {
  const ans = new Map<BoardTheme, BoardThemeInfo>();
  ans
      .set(
          BoardTheme.BLUE,
          {
            buttonEl: assert(document.getElementById('boardThemeBlueButton')),
            setCssClass: 'blueThemeBoard',
            previewCssClass: 'blueThemeBoardPreview'
          })
      .set(
          BoardTheme.GREEN,
          {
            buttonEl: assert(document.getElementById('boardThemeGreenButton')),
            setCssClass: 'greenThemeBoard',
            previewCssClass: 'greenThemeBoardPreview'
          })
      .set(
          BoardTheme.BROWN,
          {
            buttonEl: assert(document.getElementById('boardThemeBrownButton')),
            setCssClass: 'brownThemeBoard',
            previewCssClass: 'brownThemeBoardPreview'
          })
      .set(
          BoardTheme.PURPLE,
          {
            buttonEl: assert(document.getElementById('boardThemePurpleButton')),
            setCssClass: 'purpleThemeBoard',
            previewCssClass: 'purpleThemeBoardPreview'
          })
      .set(
          BoardTheme.GRAY,
          {
            buttonEl: assert(document.getElementById('boardThemeGrayButton')),
            setCssClass: 'grayThemeBoard',
            previewCssClass: 'grayThemeBoardPreview'
          });

  return ans;
}
