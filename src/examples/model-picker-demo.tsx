import * as React from "react"

import { ModelPicker } from "@/components/ui/model-picker"
import { DEMO_MODELS } from "@/lib/demo-ai"

export default function ModelPickerDemo() {
  const [model, setModel] = React.useState("aurora-flash")
  return (
    <div className="bg-card flex items-center gap-2 rounded-xl p-2">
      <ModelPicker models={DEMO_MODELS} value={model} onValueChange={setModel} />
    </div>
  )
}
