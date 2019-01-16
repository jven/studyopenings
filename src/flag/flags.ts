import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_PGN_IMPORT = 'enable_pgn_import',
  ENABLE_SOUND_TOGGLER = 'enable_sound_toggler',
  ENABLE_CLIENT_SEND_IMPRESSIONS = 'enable_client_send_impressions',
  ENABLE_SERVER_STORE_IMPRESSIONS = 'enable_server_store_impressions'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_PGN_IMPORT,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_SOUND_TOGGLER,
    RolloutState.ENABLED_EVERYWHERE);
FLAG_MAP.set(
    FlagName.ENABLE_CLIENT_SEND_IMPRESSIONS,
    RolloutState.LOCAL_ONLY);
FLAG_MAP.set(
    FlagName.ENABLE_SERVER_STORE_IMPRESSIONS,
    RolloutState.LOCAL_ONLY);
