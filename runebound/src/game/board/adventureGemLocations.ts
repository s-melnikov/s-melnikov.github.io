import type { AdventureDeck } from '../types';
import type { BoardImagePoint } from './geometry';

export interface AdventureGemLocation {
  id: string;
  type: AdventureDeck;
  imagePoint: BoardImagePoint;
}

const SOURCE_CROP = { left: 316, top: 360, width: 6537, height: 6509 } as const;
const REFERENCE_PREVIEW = { width: 1600, height: 1593 } as const;

function fromPreview(x: number, y: number): BoardImagePoint {
  return {
    x: SOURCE_CROP.left + (x / REFERENCE_PREVIEW.width) * SOURCE_CROP.width,
    y: SOURCE_CROP.top + (y / REFERENCE_PREVIEW.height) * SOURCE_CROP.height,
  };
}

/** Centers of the 27 printed adventure-gem locations on base-map-ru.jpeg. */
export const adventureGemLocations: readonly AdventureGemLocation[] = [
  { id: 'combat-1', type: 'combat', imagePoint: fromPreview(548, 134) },
  { id: 'combat-2', type: 'combat', imagePoint: fromPreview(1012, 188) },
  { id: 'combat-3', type: 'combat', imagePoint: fromPreview(1477, 455) },
  { id: 'combat-4', type: 'combat', imagePoint: fromPreview(548, 668) },
  { id: 'combat-5', type: 'combat', imagePoint: fromPreview(1013, 934) },
  { id: 'combat-6', type: 'combat', imagePoint: fromPreview(642, 1043) },
  { id: 'combat-7', type: 'combat', imagePoint: fromPreview(178, 1203) },
  { id: 'combat-8', type: 'combat', imagePoint: fromPreview(642, 1468) },
  { id: 'combat-9', type: 'combat', imagePoint: fromPreview(1477, 1514) },

  { id: 'exploration-1', type: 'exploration', imagePoint: fromPreview(827, 292) },
  { id: 'exploration-2', type: 'exploration', imagePoint: fromPreview(178, 456) },
  { id: 'exploration-3', type: 'exploration', imagePoint: fromPreview(1013, 613) },
  { id: 'exploration-4', type: 'exploration', imagePoint: fromPreview(1477, 769) },
  { id: 'exploration-5', type: 'exploration', imagePoint: fromPreview(365, 774) },
  { id: 'exploration-6', type: 'exploration', imagePoint: fromPreview(1291, 1094) },
  { id: 'exploration-7', type: 'exploration', imagePoint: fromPreview(548, 1308) },
  { id: 'exploration-8', type: 'exploration', imagePoint: fromPreview(1013, 1358) },
  { id: 'exploration-9', type: 'exploration', imagePoint: fromPreview(179, 1514) },

  { id: 'social-1', type: 'social', imagePoint: fromPreview(179, 134) },
  { id: 'social-2', type: 'social', imagePoint: fromPreview(1291, 134) },
  { id: 'social-3', type: 'social', imagePoint: fromPreview(462, 401) },
  { id: 'social-4', type: 'social', imagePoint: fromPreview(1291, 668) },
  { id: 'social-5', type: 'social', imagePoint: fromPreview(178, 879) },
  { id: 'social-6', type: 'social', imagePoint: fromPreview(920, 1094) },
  { id: 'social-7', type: 'social', imagePoint: fromPreview(1478, 1203) },
  { id: 'social-8', type: 'social', imagePoint: fromPreview(366, 1412) },
  { id: 'social-9', type: 'social', imagePoint: fromPreview(919, 1514) },
] as const;
