import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
export default function SonnerDemo() {return <><Button onClick={()=>toast.info("A notification example",{description:"This only demonstrates the message component."})}>Show notification</Button><Toaster /></>}
