import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
/** Original four-part Colorwork working mark. Export name retained for existing imports. */
export function SolidGlassMark({ className, ...props }: ComponentProps<"svg">) {
  return <svg viewBox="0 0 28 28" aria-hidden="true" className={cn("size-5", className)} {...props}><rect width="12" height="12" rx="3" fill="#6246b5"/><path d="M16 0h2a10 10 0 0 1 10 10v2H16z" fill="#a4bb7b"/><path d="M0 16h12v12h-2A10 10 0 0 1 0 18z" fill="#d4ab51"/><rect x="16" y="16" width="12" height="12" rx="3" fill="#cc7454"/></svg>
}
