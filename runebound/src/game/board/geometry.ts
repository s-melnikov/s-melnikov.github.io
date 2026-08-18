export const boardGeometry = {
  sourceImage: {
    width: 7190,
    height: 7155,
  },
  visibleBounds: {
    left: 316,
    top: 360,
    right: 6853,
    bottom: 6869,
  },
  worldSize: {
    width: 20,
    depth: 19.914,
  },
} as const;

export interface BoardImagePoint {
  x: number;
  y: number;
}

export interface BoardWorldPoint {
  x: number;
  z: number;
}

/** Converts a pixel in the original uncropped source image into board-local world units. */
export function imagePointToBoardWorld(point: BoardImagePoint): BoardWorldPoint {
  const { visibleBounds, worldSize } = boardGeometry;
  const visibleWidth = visibleBounds.right - visibleBounds.left;
  const visibleHeight = visibleBounds.bottom - visibleBounds.top;
  const normalizedX = (point.x - visibleBounds.left) / visibleWidth;
  const normalizedY = (point.y - visibleBounds.top) / visibleHeight;

  return {
    x: (normalizedX - 0.5) * worldSize.width,
    z: (normalizedY - 0.5) * worldSize.depth,
  };
}

/** UV crop matching visibleBounds. Texture V coordinates start at the bottom. */
export function getBoardTextureCrop(): {
  offsetX: number;
  offsetY: number;
  repeatX: number;
  repeatY: number;
} {
  const { sourceImage, visibleBounds } = boardGeometry;
  return {
    offsetX: visibleBounds.left / sourceImage.width,
    offsetY: (sourceImage.height - visibleBounds.bottom) / sourceImage.height,
    repeatX: (visibleBounds.right - visibleBounds.left) / sourceImage.width,
    repeatY: (visibleBounds.bottom - visibleBounds.top) / sourceImage.height,
  };
}
