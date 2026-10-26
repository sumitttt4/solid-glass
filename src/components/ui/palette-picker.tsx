"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { TAILWIND_PALETTES } from "@/components/ui/tailwind-palette"
export type PaletteChoice = { name: string; color: string }
const FLAT = TAILWIND_PALETTES.flatMap(family => family.shades.map(shade => ({ ...shade, name: family.name })))
/** Tailwind families and numbered shades. Controlled value; persistence belongs to the app. */
export function PalettePicker({ value, onValueChange, choices, label = "Component color", disabled = false }: { value: string; onValueChange: (value: string) => void; choices?: PaletteChoice[]; label?: string; disabled?: boolean }) {
  const id = useId(), grid = useRef<HTMLDivElement>(null)
  const [draft,setDraft] = useState(value || "#5943af"),[invalid,setInvalid] = useState(false)
  useEffect(()=>{setDraft(value || "#5943af");setInvalid(false)},[value])
  const [selectedToken,setSelectedToken]=useState("")
  const selected=FLAT.find(shade=>`${shade.name}-${shade.shade}`===selectedToken&&shade.color.toLowerCase()===value.toLowerCase()) ?? FLAT.find(shade=>shade.color.toLowerCase()===value.toLowerCase())
  const [focus,setFocus]=useState(FLAT.findIndex(shade=>shade.color===value)>=0?FLAT.findIndex(shade=>shade.color===value):0)
  function move(event:KeyboardEvent<HTMLButtonElement>,index:number) {
    let next=index
    if(event.key==="ArrowRight")next=Math.min(FLAT.length-1,index+1)
    else if(event.key==="ArrowLeft")next=Math.max(0,index-1)
    else if(event.key==="ArrowDown")next=Math.min(FLAT.length-1,index+11)
    else if(event.key==="ArrowUp")next=Math.max(0,index-11)
    else if(event.key==="Home")next=event.ctrlKey?0:Math.floor(index/11)*11
    else if(event.key==="End")next=event.ctrlKey?FLAT.length-1:Math.floor(index/11)*11+10
    else return
    event.preventDefault();setFocus(next);grid.current?.querySelectorAll<HTMLButtonElement>("button[data-shade]")[next]?.focus()
  }
  function custom(text:string){setDraft(text);const color=text.startsWith("#")?text:`#${text}`;if(/^#[\da-f]{6}$/i.test(color)){setInvalid(false);onValueChange(color.toLowerCase())}}
  return <fieldset data-slot="palette-picker" disabled={disabled}><legend>{label}</legend><div className="palette-picker-intro"><span>{choices?"Quick colors":"Tailwind color families"}</span><output aria-live="polite">{selected?`${selected.name} ${selected.shade} · ${selected.color}`:value?`Custom · ${value}`:"Original multicolor palette"}</output></div>
    {choices?<div className="palette-quick">{choices.map(choice=><button key={choice.color} type="button" title={choice.name} aria-label={choice.name} aria-pressed={value.toLowerCase()===choice.color.toLowerCase()} style={{backgroundColor:choice.color}} onClick={()=>onValueChange(choice.color)}>{value.toLowerCase()===choice.color.toLowerCase()&&<span aria-hidden="true">✓</span>}</button>)}</div>:<div className="palette-scroll" ref={grid} role="group" aria-label="Tailwind shades, use arrow keys to navigate"><div className="palette-shade-labels" aria-hidden="true"><span>Color</span>{TAILWIND_PALETTES[0].shades.map(s=><span key={s.shade}>{s.shade}</span>)}</div>{TAILWIND_PALETTES.map((family,row)=><div className="palette-family" key={family.name}><span>{family.name}</span>{family.shades.map((shade,column)=>{const index=row*11+column;return <button key={shade.shade} data-shade="" type="button" style={{backgroundColor:shade.color}} title={`${family.name} ${shade.shade} · ${shade.color}`} aria-label={`${family.name} ${shade.shade} ${shade.color}`} aria-pressed={selected?.name===family.name&&selected?.shade===shade.shade} tabIndex={focus===index?0:-1} onFocus={()=>setFocus(index)} onKeyDown={event=>move(event,index)} onClick={()=>{setSelectedToken(`${family.name}-${shade.shade}`);onValueChange(shade.color)}}>{selected?.name===family.name&&selected?.shade===shade.shade&&<span aria-hidden="true">✓</span>}</button>})}</div>)}</div>}
    <p className="palette-mobile-hint">Swipe across for more shades. Use arrow keys with a keyboard.</p><div className="palette-custom"><label htmlFor={`${id}-native`}>Custom<input id={`${id}-native`} aria-label="Custom color picker" type="color" value={/^#[\da-f]{6}$/i.test(value)?value:"#5943af"} onChange={e=>custom(e.target.value)} /></label><label htmlFor={`${id}-hex`}>Hex<input id={`${id}-hex`} aria-label="Custom hex color" value={draft} maxLength={7} spellCheck={false} aria-invalid={invalid} aria-describedby={invalid?`${id}-error`:undefined} onChange={e=>custom(e.target.value)} onBlur={()=>setInvalid(!/^#?[\da-f]{6}$/i.test(draft))} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();custom(draft);setInvalid(!/^#?[\da-f]{6}$/i.test(draft))}}} /></label><button type="button" className="palette-reset" onClick={()=>onValueChange("")} disabled={!value}>Reset</button></div>{invalid&&<p id={`${id}-error`} role="alert" className="palette-error">Enter six hex digits, such as #2563eb.</p>}
  </fieldset>
}
