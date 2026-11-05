---
name: glaze
description: Build React UI with Glaze (glazeui.xyz), a free shadcn-compatible component library with interface, AI chat and voice components, animated icons and four finishes (Normal, Glass, Frost, Aurora). Use when the user asks for Glaze components, glass or frosted UI, an AI chat window, model picker, token counter, voice input or transcript, or animated icons in a React + Tailwind project.
---

# Glaze

Glaze components are plain source files installed with the shadcn command line from the GitHub repository `sumitttt4/glazeui`. They land in `src/components/ui/` and are imported from `@/components/ui/<name>`.

## 1. Check the project

Glaze needs React 19, Tailwind CSS 4 and a `components.json` (from `npx shadcn@latest init`). If `components.json` is missing, run `npx shadcn@latest init` first and accept the defaults.

## 2. Install the theme once

```bash
npx shadcn@latest add sumitttt4/glazeui/glaze#main
npm i @fontsource-variable/manrope
```

Then add these lines to the main stylesheet (usually `src/index.css`), after the Tailwind imports. Skip any that are already there:

```css
@import "@fontsource-variable/manrope";
@import "./glaze.css";
@import "./materials.css";
```

Without this step components install but look unstyled.

## 3. Add components by name

```bash
npx shadcn@latest add sumitttt4/glazeui/<name>#main
```

Each item brings its own npm packages and any other Glaze components it uses. Several names can go in one command. The full list with one-line descriptions is at https://glazeui.xyz/llms.txt. Common picks:

| Need | Component |
| --- | --- |
| A complete AI chat | `chat-window` |
| Choosing a model | `model-picker` |
| Context and cost meter | `token-counter` |
| Empty-chat starters | `prompt-suggestions` |
| Answer that streams in | `streaming-text` |
| Press-to-talk with transcript | `voice-input` |
| Live speech to text | `live-transcript` |
| Voice assistant visual | `voice-orb`, `audio-waveform` |
| Read text aloud | `speak-button` |
| Animated icons | `animated-icons` |
| Switching finishes | `material-picker` |

Standard pieces (button, dialog, select, tabs, table, sidebar and so on) use their usual shadcn names.

## 4. Choose a finish

Set `data-material` on `<html>` for the whole app, or on any element for one part:

```html
<html data-material="glass">  <!-- "solid" (default), "glass", "frost" or "aurora" -->
```

Glass, Frost and Aurora need something behind them to read as glass: add the `mat-stage` class to a parent to give it a soft lit backdrop. Keep long reading text on Normal or Glass, not Frost.

## Rules

- Do not edit `glaze.css`, `materials.css` or `solid-glass.css` to restyle one component. Pass `className`, or change the CSS variables (`--primary`, `--background` and so on) in `:root` and `.dark`.
- Use sentence case for labels, realistic example data, and pair any status color with a word or icon.
- If a component's source is needed without installing, read it at `https://github.com/sumitttt4/glazeui/blob/main/src/components/ui/<name>.tsx`.
- Live previews and props: `https://glazeui.xyz/components?component=<name>`.
