# Component-browser controls and palette fixes

The supplied tablet screenshot showed a native dark option menu in the light interface. The example chooser now uses the themed Base UI Select, with opaque menu surfaces, checked selection, keyboard support and explicit close/focus handling. It is non-modal and removes the closed menu immediately so no inert menu layer blocks other controls.

## Fixes

1. Example selector: themed menu instead of browser-native options. Escape and selection restore trigger focus; outside interactions remain available.
2. Navigation: component/example/detail-view query parameters restore the selected state on refresh and browser Back. Selected components stay visible in their list. Narrow layouts scroll to the selected component instead of leaving its detail offscreen.
3. Color controls: homepage and collection use the same picker. The installed Tailwind color set supplies 26 families × 11 numbered shades (50–950), totaling 286 swatches. Chromatic families appear first; neutral families remain available below.
4. Picker behavior: named/numbered swatches, hex readout, roving arrow/Home/End navigation, custom color input, validated hex text, reset and local persistence through the site. Equivalent hex values across families keep a single selected token during interaction. Invalid hex input does not replace the active color.
5. Reuse: the registry includes the required tailwind-palette.ts helper alongside PalettePicker. Source view exposes that file for manual copy. Interactive original components include client boundaries for compatible Next.js consumers.
6. Responsive/focus: improved tablet layout; horizontal shade scrolling stays inside the palette, with a swipe hint on narrow screens. Skip navigation keeps full DOM accessibility and tab focusability without visibility:hidden, sliding into view at top: 10px on :focus-visible and resting offscreen otherwise.
7. Controls & cross-platform ergonomics: Escape closes global color palette disclosures and restores summary trigger focus; common search aliases (modal, dropdown, toggle, swatch, alert) connect natural vocabulary to component items. Documentation and registry build scripts normalize CRLF line breaks and use cross-platform process execution.

## Verification

Local Chromium checks passed: menu selection/Escape, trigger focus restoration, other controls after closure, URL refresh/Back, all 286 shades, arrow navigation, invalid/valid hex recovery, readable black text for a bright yellow custom fill, reset, local reload persistence, both page pickers, required source data and light/dark behavior. No page runtime errors during the flow. No document-level horizontal overflow at 320, 390, 768 or 960px. Desktop/tablet and mobile dark renders inspected.

Build, TypeScript, 8 existing metadata tests and whitespace checks passed. The palette is generated deterministically from installed Tailwind tokens and included in CI stale-output checks. OKLCH tokens are converted to rounded/clipped sRGB hex for this picker; that conversion is documented rather than claiming identical wide-gamut output. Full independent-app registry installation and every inherited variant remain outside this verification.

Screenshots: screenshots/example-selector-fixed.webp and screenshots/tailwind-palette.webp.
