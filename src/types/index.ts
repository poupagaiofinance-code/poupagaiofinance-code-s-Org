/**
 * Tipos fundamentais do Poupagaio Finance
 */

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemStatus {
  stage: number;
  stageName: string;
  isReady: boolean;
  version: string;
}
