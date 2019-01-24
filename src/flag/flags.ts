import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_RECORDING_STATISTICS = 'enable_recording_statistics'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_RECORDING_STATISTICS,
    RolloutState.ENABLED_EVERYWHERE);
