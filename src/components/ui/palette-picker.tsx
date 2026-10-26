import { useId } from "react"
export type PaletteChoice = { name: string; color: string }
const DEFAULT_CHOICES: PaletteChoice[] = [{ name: "Iris", color: "#5943af" }, { name: "Fern", color: "#246344" }, { name: "Clay", color: "#a3422e" }, { name: "Ocean", color: "#176078" }]
/** Controlled palette selection. Persistence belongs to the consuming app. */
export function PalettePicker({ value, onValueChange, choices = DEFAULT_CHOICES, label = "Component color", disabled = false }: { value: string; onValueChange: (value: string) => void; choices?: PaletteChoice[]; label?: string; disabled?: boolean }) {
  const id = useId()
  return <fieldset data-slot="palette-picker" disabled={disabled}><legend>{label}</legend><div>{choices.map(choice => <button key={choice.color} type="button" aria-label={choice.name} aria-pressed={value.toLowerCase() === choice.color.toLowerCase()} title={choice.name} style={{ backgroundColor: choice.color }} onClick={() => onValueChange(choice.color)}>{value.toLowerCase() === choice.color.toLowerCase() && <span aria-hidden="true">✓</span>}</button>)}<label htmlFor={id}>Custom<input id={id} type="color" value={/^#[\da-f]{6}$/i.test(value) ? value : "#5943af"} onChange={event => onValueChange(event.target.value)} /></label></div><output aria-live="polite">{value || "Original palette"}</output></fieldset>
}
