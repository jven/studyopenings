import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_STORING_PREFERENCES = 'enable_storing_preferences',
  ENABLE_STORING_STATISTICS = 'enable_storing_statistics',
  ENABLE_RECORDING_STATISTICS = 'enable_recording_statistics'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_STORING_PREFERENCES,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_STORING_STATISTICS,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_RECORDING_STATISTICS,
    RolloutState.ENABLED_EVERYWHERE);
