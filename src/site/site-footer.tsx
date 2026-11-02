import { Link } from "react-router-dom"
import { SolidGlassMark } from "@/site/logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8 text-sm md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <Link to="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.03em]">
            <SolidGlassMark className="size-5" />
            Glaze
          </Link>
          <p className="text-muted-foreground leading-relaxed">Free React components, solid or glass. By Sumit Sharma. MIT licensed.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
          <Link className="text-muted-foreground hover:text-foreground" to="/components">Components</Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/components?filter=AI+%26+Voice&component=chat-window">AI and voice</Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/components?filter=Icons&component=animated-icons">Animated icons</Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/blocks">Blocks</Link>
          <Link className="text-muted-foreground hover:text-foreground" to="/docs/installation">Installation</Link>
          <a className="text-muted-foreground hover:text-foreground" href="https://github.com/sumitttt4/solid-glass">GitHub</a>
        </div>
      </div>
      <p className="text-muted-foreground mx-auto max-w-[1400px] px-4 pb-8 sm:px-6 lg:px-8 text-xs">
        Built on <a className="underline underline-offset-2" href="https://github.com/deeplethe/solid-glass">Solid Glass</a>, shadcn/ui, Base UI and Hugeicons.
      </p>
    </footer>
  )
}
