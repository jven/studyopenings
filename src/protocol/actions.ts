import { Metadata, Repertoire } from './storage';

export interface CreateRepertoireRequest {}

export interface CreateRepertoireResponse {
  newRepertoireId: string
}

export interface DeleteRepertoireRequest {
  repertoireId: string
}

export interface DeleteRepertoireResponse {}

export interface LoadRepertoireRequest {
  repertoireId: string
}

export interface LoadRepertoireResponse {
  repertoire: Repertoire
}

export interface MetadataRequest {}

export interface MetadataResponse {
  metadataList: Metadata[]
}

export interface UpdateRepertoireRequest {
  repertoireId: string,
  repertoire: Repertoire
}

export interface UpdateRepertoireResponse {}
