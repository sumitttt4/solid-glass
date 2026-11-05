/**
 * Build the registry: what a project installs Glaze from with the shadcn command line, and llms.txt,
 * the plain-text index of it that coding agents read.
 *
 *   node scripts/build-registry.mjs
 *
 * Two things come out of it. `registry.json` at the root of the repository is the source registry
 * (https://ui.shadcn.com/schema/registry.json): it names each item and the files it is made of, and
 * is what `shadcn add deeplethe/solid-glass/<item>` reads straight from GitHub — the way the docs
 * install it. `public/r/` is the same registry built by `shadcn build` into one JSON file an item,
 * which the site serves and which `shadcn add <address>/r/<item>.json` reads.
 *
 * Solid Glass's own components name one another by their GitHub address in the first, so that one
 * installed from a tag or a commit brings the others from the same one; and by the site's address
 * in the second, which is read by whatever version of the command line is at hand.
 *
 * Only what is Solid Glass's is published: the stylesheet, and the components that have a page in
 * content/solid/. Everything else in src/components/ui is shadcn/ui's and is installed from there.
 */
import { execSync } from "node:child_process"
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { blockMetadata } from "./block-metadata.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const out = join(root, "public/r")
const read = (path) => readFileSync(join(root, path), "utf8")
// Where the site is served from, and the repository on GitHub.
const origin = (process.env.SOLID_GLASS_ORIGIN ?? "https://glazeui.xyz").replace(/\/$/, "")
const repo = "sumitttt4/glazeui"
const ref = process.env.COLORWORK_REF ?? "main"

const own = readdirSync(join(root, "content/solid"))
  .map((file) => file.replace(/\.mdx$/, ""))
  .sort()

const registryNames = readdirSync(join(root, "src/components/ui")).filter(file => file.endsWith(".tsx")).map(file => file.replace(/\.tsx$/, "")).sort()
const registryOwn = new Set(registryNames)

/** What a file needs: the packages it imports, and the components, its own by address and shadcn/ui's by name. */
function needs(content) {
  const packages = new Set()
  const others = new Set()
  for (const [, source] of content.matchAll(/from "([^"]+)"/g)) {
    if (source === "react" || source === "@/lib/utils" || source.startsWith("@/hooks/")) continue
    const used = source.match(/^@\/components\/ui\/(.+)$/)?.[1]
    if (used === "tailwind-palette") continue
    if (used) others.add(registryOwn.has(used) ? `${repo}/${used}#${ref}` : used)
    else packages.add(source.split("/").slice(0, source.startsWith("@") ? 2 : 1).join("/"))
  }
  return { dependencies: [...packages].sort(), registryDependencies: [...others].sort() }
}

// The blocks: whole screens, one file each. Their titles and descriptions are in src/blocks/index.ts.
const blockIndex = blockMetadata(read("src/blocks/index.ts"))
const blocks = readdirSync(join(root, "src/blocks"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => {
    const name = file.replace(/\.tsx$/, "")
    const entry = blockIndex.get(name)
    if (!entry) throw new Error(`Missing block metadata: ${name}`)
    return {
      name,
      type: "registry:block",
      title: entry.title,
      description: entry.description,
      ...needs(read(`src/blocks/${file}`)),
      files: [{ path: `src/blocks/${file}`, type: "registry:component" }],
    }
  })

const components = registryNames.map((name) => {
  const content = read(`src/components/ui/${name}.tsx`)
  const doc = [`content/solid/${name}.mdx`, `content/components/${name}.mdx`].find(path => existsSync(join(root,path)))
  const front = doc ? read(doc) : ""
  const hooks = [...content.matchAll(/from "@\/hooks\/([^"]+)"/g)].map(([,hook]) => hook)
  return {
    name, type: "registry:ui",
    title: front.match(/^title:\s*(.*)$/m)?.[1] ?? name.replaceAll("-", " "),
    description: front.match(/^description:\s*(.*)$/m)?.[1] ?? `Editable ${name} source with the Glaze theme.`,
    ...needs(content),
    files: [
      { path: `src/components/ui/${name}.tsx`, type: "registry:ui" },
      ...(name === "palette-picker" ? [{ path: "src/components/ui/tailwind-palette.ts", type: "registry:ui" }] : []),
      ...hooks.map(hook => ({ path: `src/hooks/${hook}.ts`, type: "registry:hook" })),
    ],
  }
})

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "glaze",
  homepage: origin,
  items: [
    {
      name: "glaze",
      type: "registry:file",
      title: "Glaze",
      description: "The Glaze theme: porcelain and pure-black surfaces, a cobalt accent, five tones, Manrope type and four finishes (Normal, Glass, Frost, Aurora).",
      files: [
        { path: "src/glaze.css", type: "registry:file", target: "src/glaze.css" },
        { path: "src/materials.css", type: "registry:file", target: "src/materials.css" },
        { path: "src/solid-glass.css", type: "registry:file", target: "src/solid-glass.css" },
      ],
    },
    {
      name: "solid-glass",
      type: "registry:file",
      title: "Solid Glass",
      description:
        "The stylesheet: the whole material in one file. Thick, smoky glass for every shadcn/ui component you already have.",
      files: [{ path: "src/solid-glass.css", type: "registry:file", target: "src/solid-glass.css" }],
    },
    ...components,
    ...blocks,
  ],
}

writeFileSync(join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`)

rmSync(out, { recursive: true, force: true })
execSync("npx shadcn build registry.json --output public/r", { cwd: root, stdio: ["ignore", "ignore", "inherit"] })
// What the site serves names Solid Glass's own by the site's address instead (see the top).
for (const file of readdirSync(out).filter((file) => file.endsWith(".json"))) {
  const path = join(out, file)
  const text = readFileSync(path, "utf8")
  const served = text.replaceAll(new RegExp(`"${repo}/([a-z0-9-]+)(?:#[^\"]+)?"`, "g"), (_, name) => JSON.stringify(`${origin}/r/${name}.json`))
  if (served !== text) writeFileSync(path, served)
}
// The stylesheet as it is, for whoever would rather copy one file than run a command.
copyFileSync(join(root, "src/solid-glass.css"), join(out, "solid-glass.css"))
copyFileSync(join(root, "src/glaze.css"), join(out, "glaze.css"))
copyFileSync(join(root, "src/materials.css"), join(out, "materials.css"))


// llms.txt: every installable item with its command, for coding agents (https://llmstxt.org).
const catalog = JSON.parse(read("src/site/catalog.generated.json"))
const about = new Map((Array.isArray(catalog) ? catalog : catalog.items ?? []).map((entry) => [entry.slug, entry.description]))
const add = (name) => `npx shadcn@latest add ${repo}/${name}#${ref}`
const line = (item) => `- ${item.name}: ${about.get(item.name) ?? item.description ?? item.title}\n  ${add(item.name)}`
const llms = `# Glaze

> Free React components (${origin}): interface components, AI and voice components, animated icons and blocks, each in four finishes (Normal, Glass, Frost, Aurora). Built on shadcn/ui, Base UI and Tailwind CSS 4. MIT licensed. Source: https://github.com/${repo}

## Set up (once)

1. A React 19 + Tailwind CSS 4 project initialised with \`npx shadcn@latest init\`.
2. Install the theme: \`${add("glaze")}\`
3. Install the font: \`npm i @fontsource-variable/manrope\`
4. In the main stylesheet, after Tailwind: \`@import "@fontsource-variable/manrope"; @import "./glaze.css"; @import "./materials.css";\`
5. Optional finish: \`<html data-material="glass">\` (or "solid", "frost", "aurora"), on <html> or any element.

Each component installs its own dependencies, including other Glaze components. Import from \`@/components/ui/<name>\`.
Source for any item, to copy instead of installing: https://github.com/${repo}/blob/${ref}/src/components/ui/<name>.tsx
Docs: ${origin}/docs · Live previews: ${origin}/components

## Components

${components.map(line).join("\n")}

## Blocks

${blocks.map(line).join("\n")}
`
writeFileSync(join(root, "public/llms.txt"), llms)

console.log(`registry: ${components.length} components, ${blocks.length} block and the stylesheet -> registry.json, public/r/`)
