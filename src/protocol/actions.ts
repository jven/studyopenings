import { MetadataJson, RepertoireJson } from './protocol';

export interface CreateRepertoireRequest {}

export interface CreateRepertoireResponse {}

export interface DeleteRepertoireRequest {
  repertoireId: string
}

export interface DeleteRepertoireResponse {}

export interface LoadRepertoireRequest {
  repertoireId: string
}

export interface LoadRepertoireResponse {
  repertoireJson: RepertoireJson
}

export interface MetadataRequest {}

export interface MetadataResponse {
  metadataList: MetadataJson[]
}

export interface SaveRepertoireRequest {
  repertoireId: string,
  repertoireJson: RepertoireJson
}

export interface SaveRepertoireResponse {}