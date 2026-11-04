import * as React from "react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { GithubIcon } from "@/components/ui/animated-icons"

export const REPO = "sumitttt4/glazeui"
export const REPO_URL = `https://github.com/${REPO}`
/** The command that installs one registry item from this repository. */
export const addCommand = (name: string) => `npx shadcn@latest add ${REPO}/${name}#main`
/** A file's page on GitHub. */
export const sourceUrl = (path: string) => `${REPO_URL}/blob/main/${path}`

const KEY = "glaze:stars"
let pending: Promise<number | null> | null = null

/** The repository's star count, fetched once per visit. Null until known, or if GitHub can't be reached. */
export function useGitHubStars() {
  const [stars, setStars] = React.useState<number | null>(() => {
    try {
      const v = sessionStorage.getItem(KEY)
      return v ? Number(v) : null
    } catch {
      return null
    }
  })
  React.useEffect(() => {
    if (stars !== null) return
    pending ??= fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (typeof d?.stargazers_count === "number" ? d.stargazers_count : null))
      .catch(() => null)
    let live = true
    void pending.then((n) => {
      if (!live || n === null) return
      setStars(n)
      try {
        sessionStorage.setItem(KEY, String(n))
      } catch {
        /* this visit only */
      }
    })
    return () => {
      live = false
    }
  }, [stars])
  return stars
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 })

/** One tap to the repository, with its star count once it has loaded. */
export function GitHubButton({ className, size = "default" }: { className?: string; size?: "sm" | "default" }) {
  const stars = useGitHubStars()
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      data-press=""
      aria-label={stars === null ? "Glaze on GitHub" : `Glaze on GitHub, ${stars} stars`}
      className={cn(
        "border-input bg-card text-foreground hover:bg-accent inline-flex shrink-0 items-center gap-2 rounded-[10px] border font-medium shadow-[0_1px_2px_#15171c0d] outline-none focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30",
        size === "sm" ? "h-8 px-2.5 text-[13px]" : "h-10 px-3.5 text-sm",
        className
      )}
    >
      <GithubIcon size={size === "sm" ? 16 : 18} />
      GitHub
      {!!stars && (
        <span className="text-muted-foreground border-border -mr-0.5 inline-flex items-center gap-1 border-l pl-2 tabular-nums">
          <HugeiconsIcon icon={StarIcon} size={13} />
          {compact.format(stars)}
        </span>
      )}
    </a>
  )
}
