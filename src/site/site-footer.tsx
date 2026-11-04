import { Link } from "react-router-dom"

import { SolidGlassMark } from "@/site/logo"
import { REPO_URL } from "@/site/github"

const PORTFOLIO = "https://sumitsharma.pro"

export function SiteFooter() {
  const link = "text-muted-foreground transition-colors hover:text-foreground"
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex max-w-sm flex-col gap-3">
          <Link to="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.03em]">
            <SolidGlassMark className="size-5" />
            Glaze
          </Link>
          <p className="leading-relaxed text-muted-foreground">Free React components, solid or glass. MIT licensed.</p>
          <p className="text-foreground">
            Made by{" "}
            <a href={PORTFOLIO} target="_blank" rel="noreferrer" className="font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground">
              Sumit Sharma
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3">
          <Link className={link} to="/components">Components</Link>
          <Link className={link} to="/components?filter=AI+%26+Voice&component=chat-window">AI and voice</Link>
          <Link className={link} to="/components?filter=Icons&component=animated-icons">Animated icons</Link>
          <Link className={link} to="/blocks">Blocks</Link>
          <Link className={link} to="/docs/installation">Installation</Link>
          <Link className={link} to="/docs/credits">Credits</Link>
          <a className={link} href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a className={link} href={PORTFOLIO} target="_blank" rel="noreferrer">sumitsharma.pro</a>
        </nav>
      </div>
      <p className="mx-auto max-w-[1400px] px-4 pb-8 text-xs text-muted-foreground sm:px-6 lg:px-8">
        Open source, built with{" "}
        <a className="underline underline-offset-2 hover:text-foreground" href="https://github.com/shadcn-ui/ui" target="_blank" rel="noreferrer">shadcn/ui</a>,{" "}
        <a className="underline underline-offset-2 hover:text-foreground" href="https://github.com/mui/base-ui" target="_blank" rel="noreferrer">Base UI</a>,{" "}
        <a className="underline underline-offset-2 hover:text-foreground" href="https://github.com/deeplethe/solid-glass" target="_blank" rel="noreferrer">Solid Glass</a> and{" "}
        <a className="underline underline-offset-2 hover:text-foreground" href="https://github.com/hugeicons" target="_blank" rel="noreferrer">Hugeicons</a>.{" "}
        <Link className="underline underline-offset-2 hover:text-foreground" to="/docs/credits">Full credits</Link>
      </p>
    </footer>
  )
}
