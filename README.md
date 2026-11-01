# Glaze

**Beautiful components. Solid or glass.**

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

## Colours

Neutral zinc surfaces, one indigo signature colour, and five tones for categories (`iris` violet, `fern` emerald, `clay` rose, `sun` amber, `ocean` sky). Any accent can be set from the palette picker or with `data-accent` and `--accent-solid` on `<html>`.

## Provenance

Derived from [deeplethe/solid-glass](https://github.com/deeplethe/solid-glass) under MIT; shadcn/ui material is covered by NOTICE.md. Icons by Hugeicons (MIT) and Lucide (ISC). Keep LICENSE and NOTICE.md with redistributed source.
