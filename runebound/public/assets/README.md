# Local game assets

Place personal Runebound base-game scans in `public/assets/local/`. This directory is excluded from Git so the files are not accidentally published.

Recommended structure:

```text
local/
  board/
  cards/
    adventure/combat/
    adventure/exploration/
    adventure/social/
    asset/
    hero/
    scenario/
    skill/
    story/
  tokens/
    adventure-gems/
    combat/
    damage/
    gold/
    story/
  figures/
  dice/
```

Use lossless PNG or WebP for the board and cards. Keep front and back images separate and use stable lowercase filenames such as `combat-c01-front.webp`.

After adding files, register their paths and physical dimensions in `src/assets/manifest.ts`.

The current Russian base-game board is expected at `local/board/base-map-ru.jpeg`. Its white print margin is cropped non-destructively through texture UV coordinates in Three.js.

The selected Abstergo Design cursor files are expected under `local/cursors/` as `fantasy-sword.png`, `fantasy-hand-open.png`, and `fantasy-hand-closed.png`.

The detailed heroes use `local/figures/hero-{row}-{column}.stl` plus a shared `local/figures/hero-base.stl`. Generate them from `.temp/figures/models.stl` and `.temp/figures/base.stl` with `scripts/extract_stl_figure.py ... --all-output-dir public/assets/local/figures`. The matching color-art sheet is expected at `local/figures/heroes.png`.
