import * as React from "react"

import { ArrowRightIcon, DownloadIcon, LoaderIcon, PlusIcon, SendIcon, SettingsIcon, TrashIcon } from "@/components/ui/animated-icons"
import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  const [saving, setSaving] = React.useState(false)
  React.useEffect(() => {
    if (!saving) return
    const t = setTimeout(() => setSaving(false), 1600)
    return () => clearTimeout(t)
  }, [saving])
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button>
          Get started <ArrowRightIcon />
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">
          <DownloadIcon /> Download
        </Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">
          <TrashIcon /> Delete
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button tone="iris">Violet</Button>
        <Button tone="fern">Emerald</Button>
        <Button tone="clay">Rose</Button>
        <Button tone="sun">Amber</Button>
        <Button tone="ocean">Sky</Button>
        <Button tone="iris" variant="secondary">Soft</Button>
        <Button tone="ocean" variant="outline">Outline</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">
          <SendIcon /> Large
        </Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <Button disabled={saving} onClick={() => setSaving(true)} className="min-w-28">
          {saving ? (
            <>
              <LoaderIcon /> Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  )
}
