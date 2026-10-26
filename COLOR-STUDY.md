# Palette workbench

The original Phase 1 experiment remains at `/color-study`. It compares Garden, Ink and Clay on the existing local-state agent workspace.

The root now opens the Colorwork component library. Its reusable theme is `src/colorwork.css`, which imports the inherited selectors from `src/solid-glass.css`. Both files are needed when copying the theme into a product. The workbench's scoped overrides remain experimental; choosing a workbench direction does not rewrite the shared theme.

See README.md and `/docs/installation` for current run/install instructions. See `docs/colorwork-verification.md` for checks and limits.
