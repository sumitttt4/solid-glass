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

Global presets/custom color affect component tones and primary controls, with reset and local persistence. Success remains a separate semantic color. Custom solid-label contrast chooses black or white; arbitrary custom palettes still need contextual review. Figtree is the main face; Plus Jakarta Sans supports navigation and labels. Both use Regular 400.

Global preset selection, arbitrary hex input, black/white label choice, reset and reload persistence passed browser checks. Figtree/Plus Jakarta font-family checks passed. Regular 400 was inspected in the rendered page. Button gradient contrast is checked against its lighter hover endpoint; arbitrary user-selected gradients are not covered by the original palette sample.

## Full collection expansion

Verified upstream main remains at 6e8903e494a15491ceda38fafea5056c95a74d44. All 75 upstream UI files, 456 original example files and 59 block files exist locally. The source catalog and registry now include 81 UI components: 75 inherited + six originals.

All 81 initial preview entry points were opened in local Chromium with no page errors or caught render failures. This is a render smoke check, not exhaustive interaction testing of every variant or all 456 inherited examples. All current catalog entries have an example; previously unrepresented Direction, Markdown and Sonner wrappers received small examples.

New component checks: Option Card native radio arrow-key selection; Palette Picker selection; Status Callout dismissal/reappearance; Copy Snippet actual clipboard write/read. Full collection source/install views, original-only filtering, search empty state, 320/390px reflow and mobile dark render passed. The generated registry graph has no missing local UI targets, invalid alias-as-package dependencies or missing files. Sidebar includes its mobile hook.

The catalog records provenance. Original UI additions are distinct from the adapted Button and inherited components. Blocks remain in the existing Blocks browser. Full independent-app installation of all 81 components is still not claimed verified.
