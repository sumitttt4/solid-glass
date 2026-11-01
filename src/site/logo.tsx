import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

/** Glaze's mark: a glossy tile, lit along its top edge. Export name kept for existing imports. */
export function SolidGlassMark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-5", className)} {...props}>
      <defs>
        <linearGradient id="glaze-fill" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b7cff" />
          <stop offset=".55" stopColor="#5b4cf0" />
          <stop offset="1" stopColor="#3b2fc4" />
        </linearGradient>
        <linearGradient id="glaze-shine" x1="16" y1="3" x2="16" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#glaze-fill)" />
      <path d="M7 12.5C7 7.5 10 5 16 5s9 2.5 9 7.5c-3-1.6-6-2.3-9-2.3s-6 .7-9 2.3Z" fill="url(#glaze-shine)" />
      <circle cx="21.5" cy="21.5" r="3.2" fill="#fff" fillOpacity=".9" />
      <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="none" stroke="#fff" strokeOpacity=".22" />
    </svg>
  )
}

export const GlazeMark = SolidGlassMark
