import type {
  CombatState,
  EnemyCombatDecisionRecord,
  EnemyCombatPolicy,
} from './types';

/**
 * Keeps enemy decisions separate from combat state transitions.
 * The policy chooses an action; the future combat engine validates and applies it.
 */
export class EnemyCombatController {
  constructor(private readonly policy: EnemyCombatPolicy) {}

  decide(state: Readonly<CombatState>): EnemyCombatDecisionRecord {
    if (state.activeSide !== 'enemy') {
      throw new Error('Enemy controller can only act during the enemy turn.');
    }

    return this.policy.chooseAction(state);
  }
}
