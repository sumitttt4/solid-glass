import { useState } from "react"
import { PalettePicker } from "@/components/ui/palette-picker"
export default function PalettePickerDemo() { const [color,setColor]=useState("#5943af");return <PalettePicker value={color} onValueChange={setColor} /> }
