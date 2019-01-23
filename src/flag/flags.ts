import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_THEME_PALETTE = 'enable_theme_palette',
  ENABLE_STORING_PREFERENCES = 'enable_storing_preferences',
  ENABLE_STORING_STATISTICS = 'enable_storing_statistics'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_THEME_PALETTE,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_STORING_PREFERENCES,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_STORING_STATISTICS,
    RolloutState.LOCAL_ONLY);
