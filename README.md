# Glaze

**Beautiful components. Solid or glass.** · [glazeui.xyz](https://glazeui.xyz)

Free React components by Sumit Sharma: UI, AI & voice and animated icons, designed together and each available in four materials. Copy a component, install it with one command, or hand the registry to your coding agent. No pro tier. **Alpha.**

![Glaze](docs/screenshots/glaze-home.png)

## What's inside

- **UI components**: the full shadcn/ui + Solid Glass set, restyled with one colour system and one typeface (Geist), plus originals: Tone Badge, Color Surface, Palette Picker, Option Card, Status Callout, Copy Snippet.
- **AI & voice**: Chat Window, Model Picker, Prompt Suggestions, Token Counter, Voice Orb, Live Transcript (in-browser speech to text), Voice Input, Audio Waveform, Streaming Text and Speak Button (text to speech), with the inherited agent UI (Composer, Reasoning, Tool Steps…).
- **Animated icons**: built on [Hugeicons](https://hugeicons.com) (MIT). A tuned set of 39 (bells ring, bins open, rockets launch, two-state copy/menu/theme/mic/play), and `AnimatedIcon`, which animates **any** Hugeicon with 18 presets.
- **Materials**: `data-material="solid" | "glass" | "frost" | "aurora"` on `<html>` or on any element. On `/components`, every preview can switch material or compare Normal and glass side by side.

## Install

```bash
npx shadcn@latest add sumitttt4/solid-glass/glaze#main        # theme + materials
npx shadcn@latest add sumitttt4/solid-glass/chat-window#main  # any component
```

Import `glaze.css` then `materials.css` after Tailwind (both need `solid-glass.css`, which the theme item installs). See `/docs/installation`.

## Run locally

Node 22.12+.

```bash
npm ci
npm run dev        # http://localhost:5191
npm run typecheck
npm run build
```

## Colours, type and motion

- **Colour:** named after ceramic glazes. Porcelain `#F3F5F7` and Kiln `#101216` grounds, Ink `#15171C` text, Cobalt `#2445E6` as the signature, Celadon `#8FC9B6` as its partner, Oxblood `#B42318` for destructive actions. Five tones for categories (`iris` violet, `fern` emerald, `clay` rose, `sun` amber, `ocean` sky). Set any accent from the palette picker, or with `data-accent` and `--accent-solid` on `<html>`.
- **Type:** Manrope throughout: regular for reading, medium and semibold for controls and headings.
- **Motion:** follows Emil Kowalski's standards. Custom ease-out curves, popovers grow from their trigger in 180ms and close faster, dialogs stay centred, buttons scale to 0.97 on press, hover motion only on real pointers, and no animation on the keyboard-opened command palette.
- **Backdrops:** the site's glass stages use [Paper Shaders](https://shaders.paper.design) mesh gradients (Apache-2.0). They load lazily, run only while on screen, and hold still under reduced motion. They are part of the site, not the installable components.

## Stress testing

`/dev/worst` (development only) feeds the AI components realistic worst-case data, behind a Demo / Worst case / Empty / One toggle: long names, unbreakable emails and URLs, 2,000-character pastes, zero and over-limit token counts. Keep it as the regression check when changing them.

## Provenance

Derived from [deeplethe/solid-glass](https://github.com/deeplethe/solid-glass) under MIT; shadcn/ui material is covered by NOTICE.md. Icons by Hugeicons (MIT) and Lucide (ISC). Keep LICENSE and NOTICE.md with redistributed source.
