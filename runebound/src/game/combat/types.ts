export type CombatSide = 'hero' | 'enemy';

export type CombatSymbol =
  | 'physical-damage'
  | 'magic-damage'
  | 'enemy-damage'
  | 'shield'
  | 'agility'
  | 'surge'
  | 'double';

export interface CombatTokenFace {
  id: string;
  symbols: readonly CombatSymbol[];
}

export interface CombatTokenState {
  id: string;
  owner: CombatSide;
  currentFace: CombatTokenFace;
  oppositeFace: CombatTokenFace;
  spent: boolean;
  stackedOnTokenId: string | null;
}

export interface CombatantState {
  id: string;
  side: CombatSide;
  health: number;
  damage: number;
  tokens: readonly CombatTokenState[];
}

export interface CombatState {
  round: number;
  activeSide: CombatSide;
  hero: CombatantState;
  enemy: CombatantState;
  consecutivePasses: number;
}

export type EnemyCombatDecision =
  | { type: 'deal-enemy-damage'; tokenIds: readonly string[] }
  | { type: 'use-shields'; tokenIds: readonly string[]; amount: number }
  | { type: 'use-agility'; tokenId: string; targetTokenId: string }
  | { type: 'use-surge'; abilityId: string; tokenIds: readonly string[] }
  | { type: 'recast'; tokenId: string }
  | { type: 'pass' };

export interface EnemyCombatDecisionRecord {
  decision: EnemyCombatDecision;
  reason: string;
}

export interface EnemyCombatPolicy {
  chooseAction(state: Readonly<CombatState>): EnemyCombatDecisionRecord;
}
