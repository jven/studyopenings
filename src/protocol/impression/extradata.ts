import { BoardTheme } from '../boardtheme';
import { Color } from '../color';
import { SoundValue } from '../soundvalue';

export interface ExtraData {
  importedPgn?: string,
  boardTheme?: BoardTheme,
  soundValue?: SoundValue,
  color?: Color
}
