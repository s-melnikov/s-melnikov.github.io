export type ScenarioId = 'ascendance-of-margath' | 'corpse-king';

export type AdventureDeck = 'combat' | 'exploration' | 'social';

export interface TablePosition {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

export interface TablePieceState {
  id: string;
  assetId: string;
  position: TablePosition;
  face: 'front' | 'back';
  locked: boolean;
}

export interface GameState {
  version: 1;
  scenarioId: ScenarioId | null;
  round: number;
  activeHeroId: string | null;
  pieces: Record<string, TablePieceState>;
}

/**
 * The tabletop renderer consumes state but does not enforce game rules.
 * A future solo controller can emit the same commands as a human player.
 */
export type TableCommand =
  | { type: 'piece.move'; pieceId: string; position: TablePosition }
  | { type: 'piece.flip'; pieceId: string }
  | { type: 'deck.draw'; deckId: string; destination: TablePosition }
  | { type: 'turn.end' };
