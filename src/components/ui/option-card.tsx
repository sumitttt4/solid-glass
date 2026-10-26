import { useId, type ReactNode } from "react"
import type { ColorTone } from "@/components/ui/tone-badge"
/** Native radio behavior preserves keyboard navigation inside a shared name. */
export function OptionCard({ name, value, checked, onValueChange, title, description, icon, tone = "iris", disabled = false }: { name: string; value: string; checked: boolean; onValueChange: (value: string) => void; title: string; description?: string; icon?: ReactNode; tone?: ColorTone; disabled?: boolean }) {
  const id = useId()
  return <label data-slot="option-card" data-tone={tone} data-checked={checked || undefined} data-disabled={disabled || undefined} htmlFor={id}><input id={id} type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onValueChange(value)} /><span className="cw-option-copy">{icon && <span aria-hidden="true">{icon}</span>}<strong>{title}</strong>{description && <span>{description}</span>}</span></label>
}
