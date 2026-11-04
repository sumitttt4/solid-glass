# Contributing to Glaze

Thanks for helping. Glaze is maintained by [Sumit Sharma](https://sumitsharma.pro).

## Before you start

- **A bug:** open an [issue](https://github.com/sumitttt4/glazeui/issues) with a screenshot and steps to reproduce.
- **A new component or block:** open an issue first and describe where you would use it.
- **A small fix** (a typo, a spacing bug, a broken link): a pull request is fine straight away.

## Run it

```bash
npm ci
npm run dev        # http://localhost:5191
npm run typecheck
npm run build
```

Node 22.12 or newer.

## How the repo is laid out

| Path | What it is |
| --- | --- |
| `src/components/ui/` | The components. This is what the registry publishes. |
| `src/examples/` | One file per example shown on the site. |
| `content/` | Docs pages (`docs/`) and per-component pages (`solid/`, `components/`). |
| `src/blocks/` | Whole screens. Single files at the top level are published in the registry. |
| `src/glaze.css`, `src/materials.css`, `src/solid-glass.css` | The theme, the four finishes and the glass foundation. |
| `scripts/` | Build the docs, the catalog, the registry (`registry.json`, `public/r/`) and `llms.txt`. |

`npm run docs` regenerates the registry and catalog. Commit what it changes; CI fails if they are out of date.

## What a good change looks like

- Works in light and dark mode, and in all four finishes.
- Holds up with long text, empty states and a 320px-wide screen.
- Sentence case for labels and headings. Real-looking example data, never Lorem ipsum.
- A new component comes with an example in `src/examples/` and a page in `content/solid/`.
