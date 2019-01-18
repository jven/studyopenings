import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_SERVER_STORE_IMPRESSIONS = 'enable_server_store_impressions'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_SERVER_STORE_IMPRESSIONS,
    RolloutState.ENABLED_EVERYWHERE);
