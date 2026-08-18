export type AssetKind =
  | 'board'
  | 'card'
  | 'token'
  | 'hero-figure'
  | 'terrain-die'
  | 'combat-token';

export interface AssetDefinition {
  id: string;
  kind: AssetKind;
  front: string;
  back?: string;
  widthMm: number;
  heightMm: number;
  thicknessMm?: number;
}

/**
 * Add real local scans here after placing them under public/assets/local/.
 * The local directory is gitignored so personal materials are not published.
 */
export const assetManifest: readonly AssetDefinition[] = [];
