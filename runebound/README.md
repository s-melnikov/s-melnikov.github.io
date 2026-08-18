# Runebound 3rd Edition — personal virtual tabletop

Private desktop-only browser tabletop for the Runebound base game. Three.js renders only the board, hero figures, terrain dice and adventure gems. Cards, decks, resources, markets and combat controls use HTML panels over the WebGL canvas. Rules enforcement is intentionally separate from rendering.

## Current scope

- Base game only.
- Desktop browser.
- One local player.
- Manual virtual tabletop: display and manipulate components without rules enforcement.
- Enemy combat is the only automated subsystem: the player controls the hero, while a deterministic controller operates the enemy side.
- Placeholder board and pieces until personal scans are added.

## Commands

```sh
npm install
npm run typecheck
npm run build
```

Use `npm run dev` only when a browser preview is wanted.

## Project map

```text
src/
  assets/       asset catalog and scan metadata
  game/         serializable state, commands and enemy-combat controller contracts
  tabletop/     Three.js scene, camera, lighting and canvas rendering
public/assets/  local scans (gitignored) and asset instructions
```

The agreed base-game inventory and active table layout are documented in `GAME_COMPONENTS.md` and represented as typed data in `src/game/components.ts`.

Board geometry lives in `src/game/board/geometry.ts`. It converts stable source-image pixels into Three.js world coordinates. The 27 adventure-gem centers are stored separately in `src/game/board/adventureGemLocations.ts`.

Custom game cursors are selected from Abstergo Design's Fantasy Cursor Pack. The free asset page does not state a standard license, so the images remain in Git-ignored local assets. Source and usage details are preserved in `src/assets/cursors/SOURCE.md`.

Hero placeholders are replaced at runtime by 12 local figure STL files and a shared base STL. `scripts/extract_stl_figure.py` extracts the complete 3×4 figure sheet. Bases have an untextured solid material; figures have a solid-color backing plus separate front and reverse art layers.

The 12 STL components correspond positionally to the upper 3×4 grid in `heroes.png`. `src/game/heroes/figureCatalog.ts` records the explicit front/back mapping; the lower half repeats the same art in reverse column order for print assembly.

Hero art is cropped to its real transparent bounds and rendered on two thin planes over the solid-color STL silhouette. Reverse art is loaded from its mapped lower-half PNG cell, where it is already mirrored. `HERO_WORLD_HEIGHT` in `TabletopScene.ts` controls the complete standee size.

## Rules model captured from Learn to Play

The base model needs to cover six heroes, two scenarios, three adventure decks, story/skill/asset cards, a three-action turn, terrain-die movement, shopping, adventure, rest, train, tests, quests, combat tokens and the time track. This is only an inventory for future implementation; the current tabletop does not validate any of those rules.

## Solo combat model

Outside combat, the application remains a manual virtual tabletop. During combat, a deterministic controller manages the enemy side: available combat tokens, token flips and recasts, enemy-only actions, shields, surge abilities, passing and retreat-related flow. It must make decisions only from combat information available to a human opponent and produce an event log explaining every choice.

The combat policy will be implemented after the enemy cards and all combat-token faces are added to the asset/data catalog.
