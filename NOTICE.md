# Notices

Glaze UI
Copyright 2026 Sumit Sharma

Glaze UI is licensed under the Apache License, Version 2.0 (see `LICENSE`). It includes work from
the projects below, which are MIT licensed. Those parts remain available under their original MIT
terms, and their copyright and permission notices are reproduced here as the MIT License requires.

Glaze includes code from [shadcn/ui](https://github.com/shadcn-ui/ui) and [Solid Glass](https://github.com/deeplethe/solid-glass), both MIT licensed. From shadcn/ui, the following are taken
at commit `02cad61166c4c20edbc8a3f71bd720eed4c1f49b`, and are released under the MIT License:

- `src/components/ui/`: the components, installed with its command line (all but the Solid Glass and
  Glaze UI originals).
- `src/examples/`: its examples (`apps/v4/examples/base`), with import paths changed.
- `content/components/`: its documentation for each component (`apps/v4/content/docs/components/base`).
- `src/create/cards/` and `src/create/blocks.tsx`: the preview its Create page shows
  (`apps/v4/registry/bases/base/blocks/preview`), at commit `993eb2c3151997ce08a49635c10fd8c8ef3713c7`, with import paths changed.
  The Create page itself (`src/pages/create.tsx`, `src/create/customizer.tsx`) is laid out after its.
- `src/blocks/<name>/` (the blocks in folders: `dashboard-01`, the `sidebar-*`, `login-*` and
  `signup-*` ones): its blocks (`apps/v4/registry/bases/base/blocks`), at commit
  `993eb2c3151997ce08a49635c10fd8c8ef3713c7`, with import paths changed and each icon written as the
  Lucide icon it names, as its own build writes them. `public/placeholder.svg` is its too. The Blocks
  page (`src/pages/blocks.tsx`) is laid out after its.
- The layout of the site in `src/site/` follows its documentation site.

> MIT License
>
> Copyright (c) 2023 shadcn
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
> associated documentation files (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge, publish, distribute,
> sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
> NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
> DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
> OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The interaction and accessibility of the components come from [Base UI](https://base-ui.com) (MIT).
Icons are [Lucide](https://lucide.dev) (ISC), with [Tabler](https://tabler.io/icons) (MIT) and
[Hugeicons](https://hugeicons.com) in some of shadcn/ui's examples. The typefaces are
[Geist and Geist Mono](https://vercel.com/font) (SIL Open Font License).

## Solid Glass

The glass foundation (`src/solid-glass.css`) and the components ask-card, composer, context-ring,
diff-view, dot-loader, panel, reasoning, status-glyph, tag, task-notice, tool-steps and turn-status
come from Solid Glass by DeepLethe, under the MIT License:

> MIT License
>
> Copyright (c) 2026 DeepLethe
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
> associated documentation files (the "Software"), to deal in the Software without restriction,
> including without limitation the rights to use, copy, modify, merge, publish, distribute,
> sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
> NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
> DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
> OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Fonts and data

Manrope and Geist Mono are loaded through Fontsource under the SIL Open Font License; the font
packages include their license texts. The Button's finish was informed by Cloudflare Kumo's
published button patterns; it does not include the Kumo runtime package.

The palette data is generated from Tailwind CSS color tokens (MIT), converted from OKLCH to rounded/clipped sRGB hex. Tailwind CSS copyright (c) Tailwind Labs, Inc. The installed tailwindcss package contains its MIT license.
