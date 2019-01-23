import { BoardTheme } from '../boardtheme';
import { SoundValue } from '../soundvalue';

export interface Preference {
  boardTheme?: BoardTheme,
  soundValue?: SoundValue
}

export function mergePreferences(
    source: Preference, other: Preference): Preference {
  const result = source;
  if (other.boardTheme) {
    result.boardTheme = other.boardTheme;
  }
  if (other.soundValue) {
    result.soundValue = other.soundValue;
  }

  return result;
}
