import type { BoardWorldPoint } from './geometry';
import { boardGeometry } from './geometry';

export interface HexCoordinate {
  q: number;
  r: number;
}

export interface BoardHex {
  id: string;
  coordinate: HexCoordinate;
  center: BoardWorldPoint;
}

const REFERENCE_SIZE = { width: 1600, height: 1593 } as const;
const CALIBRATED_GRID = {
  originX: 182,
  originY: 28,
  columnStep: 93,
  halfRowStep: 53.37,
} as const;
const GRID = {
  originX: CALIBRATED_GRID.originX,
  originY: CALIBRATED_GRID.originY,
  columnStep: CALIBRATED_GRID.columnStep,
  halfRowStep: CALIBRATED_GRID.halfRowStep,
  minQ: 0,
  maxQ: 14,
  minRowIndex: 1,
  maxRowIndex: 28,
} as const;

export const BOARD_HEX_RADIUS =
  ((GRID.columnStep / 1.5) / REFERENCE_SIZE.width) * boardGeometry.worldSize.width;

export function worldPointToBoardHex(point: BoardWorldPoint): BoardHex | null {
  const previewPoint = {
    x: (point.x / boardGeometry.worldSize.width + 0.5) * REFERENCE_SIZE.width,
    y: (point.z / boardGeometry.worldSize.depth + 0.5) * REFERENCE_SIZE.height,
  };
  const approximateQ = Math.round((previewPoint.x - GRID.originX) / GRID.columnStep);
  let closest: { q: number; r: number; distanceSquared: number } | null = null;

  for (let q = approximateQ - 1; q <= approximateQ + 1; q += 1) {
    const approximateRowIndex = (previewPoint.y - GRID.originY) / GRID.halfRowStep;
    const approximateR = Math.round((approximateRowIndex - q) / 2);

    for (let r = approximateR - 1; r <= approximateR + 1; r += 1) {
      const rowIndex = 2 * r + q;
      if (
        q < GRID.minQ ||
        q > GRID.maxQ ||
        rowIndex < GRID.minRowIndex ||
        rowIndex > GRID.maxRowIndex
      ) {
        continue;
      }

      const centerX = GRID.originX + q * GRID.columnStep;
      const centerY = GRID.originY + rowIndex * GRID.halfRowStep;
      const distanceSquared =
        (previewPoint.x - centerX) ** 2 + (previewPoint.y - centerY) ** 2;
      if (!closest || distanceSquared < closest.distanceSquared) {
        closest = { q, r, distanceSquared };
      }
    }
  }

  if (!closest) return null;
  return makeBoardHex(closest.q, closest.r);
}

export function makeBoardHex(q: number, r: number): BoardHex {
  const rowIndex = 2 * r + q;
  const previewX = GRID.originX + q * GRID.columnStep;
  const previewY = GRID.originY + rowIndex * GRID.halfRowStep;
  return {
    id: `hex-${q}-${r}`,
    coordinate: { q, r },
    center: {
      x: (previewX / REFERENCE_SIZE.width - 0.5) * boardGeometry.worldSize.width,
      z: (previewY / REFERENCE_SIZE.height - 0.5) * boardGeometry.worldSize.depth,
    },
  };
}
