import { useState } from "react"
import { DirectionProvider } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
export default function DirectionDemo() {const [dir,setDir]=useState<"ltr"|"rtl">("ltr");return <DirectionProvider direction={dir}><div dir={dir} className="grid gap-5"><p>Current layout direction: {dir.toUpperCase()}</p><div className="flex gap-3"><span>First</span><span>Second</span><span>Third</span></div><Button onClick={()=>setDir(dir==="ltr"?"rtl":"ltr")}>Switch layout direction</Button></div></DirectionProvider>}
