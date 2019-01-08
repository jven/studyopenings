import { RolloutState } from "./rolloutstate";

export enum FlagName {
  ENABLE_PGN_IMPORT = 'enable_pgn_import'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP.set(
    FlagName.ENABLE_PGN_IMPORT,
    RolloutState.LOCAL_ONLY);