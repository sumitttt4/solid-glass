import { useState } from "react"
import { StatusCallout } from "@/components/ui/status-callout"
import { Button } from "@/components/ui/button"
export default function StatusCalloutDemo() { const [shown,setShown]=useState(true);return shown?<StatusCallout status="info" title="Your palette is ready" onDismiss={()=>setShown(false)}>Use these roles as a starting point. Check contrast in your own product.</StatusCallout>:<Button onClick={()=>setShown(true)}>Show callout</Button> }
