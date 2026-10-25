# Color language: first-screen experiment

Phase 1 on the original agent workspace. No final palette or product name is chosen.

## Run

Use Node 22.12+ (CI uses Node 22), then `npm ci` and `npm run dev`.
Open `http://localhost:5191/` or `/color-study`.

Compare Garden (leaf/lilac), Ink (cobalt/mineral), and Clay (terracotta/sage), in both themes. The selection is encoded in the URL, so refresh keeps the same view.

The original component examples remain at `/dev/examples` during development. The study stylesheet applies only while the study route is mounted, including to Base UI's portalled menus. Shared `solid-glass.css` is deliberately unchanged until one screen has been reviewed.

## Color jobs

- Character: tinted workspace background and sidebar.
- Structure: related but distinct panel hues separate files/tasks from the thread.
- Hierarchy: saturated primary action; quieter secondary and card surfaces.
- Interaction: selected rows have a colored leading edge, hover has a tint, keyboard focus has an explicit outline.
- Status: existing written task states remain; the error preview includes text and preserves the draft.

Glass blur and highlight variables are neutralized in this experiment. Backgrounds are opaque, panels use fine borders, and menus retain only a small elevation shadow. This is a local-state demo; it makes no AI calls. The error checkbox is a visual fixture, not a simulated network failure.

## Review before promoting tokens

1. Compare all three directions in light/dark.
2. Select sessions, search, attach a file, choose a decision, send a draft, stop a task, and open Mode/Model/Effort menus.
3. Tab through controls; inspect hover, chosen, disabled send, and error preview states.
4. Inspect 390px mobile and desktop; open/close the mobile navigation and right panels.
5. Measure actual rendered foreground/background contrast, including text opacity and nested surfaces. Do not treat token design as AA certification.

## Validation

- `npm run docs`: passed (documentation and registry generation).
- `npm run typecheck`: passed after generating docs.
- `npm run build`: passed; upstream dynamic-import warning remains.
- `node --test scripts/block-metadata.test.mjs`: 8 passed.
- Rendered browser/interaction, mobile, and contrast review: pending. The available review browser could not connect to the workspace's loopback server.

No dependency additions. LICENSE and NOTICE.md retained. No registry distribution changes; upstream install commands still install upstream files.
