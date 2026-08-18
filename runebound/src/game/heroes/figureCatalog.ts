export interface TextureCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeroArtRegion {
  grid: { row: number; column: number };
  crop: TextureCrop;
}

export interface HeroFigureDefinition {
  id: string;
  modelGrid: { row: number; column: number };
  art: {
    front: HeroArtRegion;
    back: HeroArtRegion;
  };
}

const ART_CROPS: readonly (readonly TextureCrop[])[] = [
  [
    { x: 0, y: 39, width: 157, height: 198 },
    { x: 205, y: 92, width: 157, height: 145 },
    { x: 403, y: 0, width: 166, height: 237 },
    { x: 579, y: 27, width: 197, height: 210 },
  ],
  [
    { x: 0, y: 295, width: 157, height: 185 },
    { x: 170, y: 279, width: 192, height: 201 },
    { x: 403, y: 287, width: 166, height: 193 },
    { x: 583, y: 304, width: 158, height: 176 },
  ],
  [
    { x: 0, y: 517, width: 157, height: 208 },
    { x: 205, y: 498, width: 157, height: 227 },
    { x: 403, y: 529, width: 166, height: 196 },
    { x: 583, y: 496, width: 158, height: 229 },
  ],
  [
    { x: 4, y: 765, width: 197, height: 212 },
    { x: 220, y: 738, width: 157, height: 239 },
    { x: 418, y: 830, width: 157, height: 147 },
    { x: 623, y: 778, width: 157, height: 199 },
  ],
  [
    { x: 39, y: 1042, width: 157, height: 177 },
    { x: 214, y: 1026, width: 163, height: 193 },
    { x: 418, y: 1018, width: 192, height: 201 },
    { x: 623, y: 1034, width: 157, height: 185 },
  ],
  [
    { x: 39, y: 1235, width: 158, height: 228 },
    { x: 211, y: 1268, width: 166, height: 195 },
    { x: 418, y: 1237, width: 157, height: 226 },
    { x: 623, y: 1257, width: 157, height: 206 },
  ],
] as const;

function artRegion(row: number, column: number): HeroArtRegion {
  const crop = ART_CROPS[row - 1]?.[column - 1];
  if (!crop) throw new Error(`Hero art crop is missing: [${row}:${column}]`);
  return { grid: { row, column }, crop };
}

/**
 * The STL sheet is arranged as 3 rows by 4 columns. Front art uses the same
 * position in rows 1-3; matching reverse art is in rows 4-6, reversed by column.
 */
export const heroFigureCatalog: readonly HeroFigureDefinition[] = Array.from(
  { length: 12 },
  (_, index) => {
    const row = Math.floor(index / 4) + 1;
    const column = (index % 4) + 1;
    const backRow = row + 3;
    const backColumn = 5 - column;

    return {
      id: `hero-${row}-${column}`,
      modelGrid: { row, column },
      art: {
        front: artRegion(row, column),
        back: artRegion(backRow, backColumn),
      },
    };
  },
);
