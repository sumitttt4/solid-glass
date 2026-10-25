# Colorwork alpha: verification

## Direction

Glyph design skill used from the available Glyph-Skill source. Chosen composition: component-first catalog with a short expressive hero, searchable/filterable examples, code dialogs, and color foundations. An editorial landing would delay access to components; a dense workbench would make discovery harder. Color and original geometric artwork carry the personality. Colorwork is a provisional name, with availability unchecked.

Hero: **Build your site with a little more color.**

Body: Explore a growing library of expressive React components. Pick a starting point, copy the code, and make it yours.

Actions: Explore the library / Get started.

## Checked in a local headless Chromium render

- Desktop 1440px, mobile 390px and 320px; both themes rendered and inspected.
- No horizontal document overflow at 320px and 390px.
- Favorite toggle, required project-name validation and editable recovery.
- Menu opens and handles a local action.
- Code dialog, actual clipboard write/read, Escape, and focus return.
- Search, empty results, reset, category filtering and mobile category menu.
- Theme choice survives reload.
- Installation page loads its own theme instructions.
- No page runtime errors during this flow.
- 12 sampled text/background combinations in each theme measured at >=4.5:1; lowest sampled ratio 5.28:1. Includes hero body, secondary text, action, setting/input labels, success message and five tone badge pairs. This is a targeted sample, not a whole-site accessibility certification.

## Code checks

Documentation and registry generation, TypeScript, production build, 8 existing metadata tests and whitespace checks passed. Upstream warning about an ineffective dynamic import remains.

## Distribution

Registry source points to sumitttt4/solid-glass with own dependencies pinned to color-language. Generated Colorwork item includes BOTH CSS files. Local registry structure verified. The full shadcn install flow in an independent consuming app is not verified. No npm release or live deployment is claimed. Pages configuration now uses the fork owner; enabling Pages is a separate hosting step.

## Limits

Demos keep state in memory and make no backend calls. Color scoping does not automatically follow a portal outside its parent subtree; global theme roles do. Original component APIs and inherited CSS hooks remain. The full inherited component catalog needs continuing visual and accessibility review. This is an alpha foundation, not a claim of superiority across every component.

## Button, color and typography revision

Kumo official button documentation/source informed the emphasis finish (tonal fill, edge, restrained highlight, pressed response); Kumo's runtime package and skill were not installed in this environment. The implementation retains Base UI and adds an explicit tone prop. Reference: https://github.com/cloudflare/kumo/blob/main/packages/kumo/src/components/button/button.tsx

Global presets/custom color affect component tones and primary controls, with reset and local persistence. Success remains a separate semantic color. Custom solid-label contrast chooses black or white; arbitrary custom palettes still need contextual review. Manrope is the main face; Plus Jakarta Sans supports navigation and labels. Both use Regular 400.

Global preset selection, arbitrary hex input, black/white label choice, reset and reload persistence passed browser checks. Manrope/Plus Jakarta font-family checks passed. Regular 400 was inspected in the rendered page. Button gradient contrast is checked against its lighter hover endpoint; arbitrary user-selected gradients are not covered by the original palette sample.
