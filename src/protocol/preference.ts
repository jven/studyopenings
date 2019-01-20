import { BoardTheme } from './boardtheme';

export interface Preference {
  boardTheme?: BoardTheme
}

export function mergePreferences(
    source: Preference, other: Preference): Preference {
  const result = source;
  if (other.boardTheme) {
    result.boardTheme = other.boardTheme;
  }

  return result;
}
