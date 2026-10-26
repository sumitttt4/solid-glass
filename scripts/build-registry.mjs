/**
 * Build the registry: what a project installs Solid Glass from with the shadcn command line.
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
import { execFileSync } from "node:child_process"
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { blockMetadata } from "./block-metadata.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const out = join(root, "public/r")
const read = (path) => readFileSync(join(root, path), "utf8")
// Where the site is served from, and the repository on GitHub.
const origin = (process.env.SOLID_GLASS_ORIGIN ?? "https://sumitttt4.github.io/solid-glass").replace(/\/$/, "")
const repo = "sumitttt4/solid-glass"
const ref = process.env.COLORWORK_REF ?? "color-language"

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
    description: front.match(/^description:\s*(.*)$/m)?.[1] ?? `Editable ${name} source with the Colorwork theme.`,
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
  name: "colorwork",
  homepage: origin,
  items: [
    {
      name: "colorwork",
      type: "registry:file",
      title: "Colorwork",
      description: "Opaque surfaces, five expressive color roles, paired themes and visible interaction states.",
      files: [
        { path: "src/colorwork.css", type: "registry:file", target: "src/colorwork.css" },
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
execFileSync("npx", ["shadcn", "build", "registry.json", "--output", "public/r"], { cwd: root, stdio: ["ignore", "ignore", "inherit"] })
// What the site serves names Solid Glass's own by the site's address instead (see the top).
for (const file of readdirSync(out).filter((file) => file.endsWith(".json"))) {
  const path = join(out, file)
  const text = readFileSync(path, "utf8")
  const served = text.replaceAll(new RegExp(`"${repo}/([a-z0-9-]+)(?:#[^\"]+)?"`, "g"), (_, name) => JSON.stringify(`${origin}/r/${name}.json`))
  if (served !== text) writeFileSync(path, served)
}
// The stylesheet as it is, for whoever would rather copy one file than run a command.
copyFileSync(join(root, "src/solid-glass.css"), join(out, "solid-glass.css"))
copyFileSync(join(root, "src/colorwork.css"), join(out, "colorwork.css"))

console.log(`registry: ${components.length} components, ${blocks.length} block and the stylesheet -> registry.json, public/r/`)
