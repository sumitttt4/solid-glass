import type { ReactNode } from "react"
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
const states = { success: { icon: CheckCircle2, tone: "fern" }, error: { icon: CircleAlert, tone: "clay" }, warning: { icon: TriangleAlert, tone: "sun" }, info: { icon: Info, tone: "ocean" } } as const
export function StatusCallout({ status = "info", title, children, onDismiss, announce = true }: { status?: keyof typeof states; title: string; children?: ReactNode; onDismiss?: () => void; announce?: boolean }) {
  const state = states[status]; const Icon = state.icon
  return <section data-slot="status-callout" data-tone={state.tone} data-semantic={status} role={announce ? status === "error" ? "alert" : "status" : undefined} aria-label={title}><Icon aria-hidden="true" /><div><strong>{title}</strong>{children && <div>{children}</div>}</div>{onDismiss && <Button variant="ghost" size="icon-sm" aria-label={`Dismiss ${title}`} onClick={onDismiss}><X /></Button>}</section>
}
