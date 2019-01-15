import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_PGN_IMPORT = 'enable_pgn_import',
  ENABLE_SOUND_TOGGLER = 'enable_sound_toggler'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_PGN_IMPORT,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_SOUND_TOGGLER,
    RolloutState.LOCAL_ONLY);
