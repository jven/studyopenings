import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_BOARD_THEME_TOGGLER = 'enable_board_theme_togger'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_BOARD_THEME_TOGGLER,
    RolloutState.LOCAL_ONLY);
