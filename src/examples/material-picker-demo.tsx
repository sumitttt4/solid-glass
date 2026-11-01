import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MaterialPicker, type Material } from "@/components/ui/material-picker"
import { Switch } from "@/components/ui/switch"

/** A material set on one element finishes only what is inside it. */
export default function MaterialPickerDemo() {
  const [material, setMaterial] = React.useState<Material>("frost")
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <MaterialPicker value={material} onValueChange={setMaterial} />
      <div data-material={material} className="mat-stage w-full rounded-2xl p-8">
        <div className="bg-card mx-auto flex max-w-xs flex-col gap-3 rounded-xl p-5">
          <strong className="text-sm font-medium">Sign in</strong>
          <Input placeholder="you@example.com" aria-label="Email" />
          <label className="text-muted-foreground flex items-center justify-between text-xs">
            Remember me <Switch defaultChecked aria-label="Remember me" />
          </label>
          <Button>Continue</Button>
        </div>
      </div>
    </div>
  )
}
