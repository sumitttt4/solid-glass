import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

const NOTES = [
  "Search now matches file contents, not just names.",
  "Comments can be resolved from the notification itself.",
  "Exports include attachments as a single zip.",
  "The sidebar remembers which sections you collapsed.",
  "Keyboard shortcuts work inside tables: arrows move between cells, Enter edits.",
  "Dark mode follows your system setting by default.",
  "Uploads over 100 MB resume after a lost connection.",
  "Fixed: dates in other time zones showed a day early.",
  "Fixed: the share menu could open off screen on small phones.",
  "Fixed: long project names no longer push the toolbar out of view.",
]

export default function SheetSide() {
  return (
    <div className="flex flex-wrap gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={<Button variant="outline" className="capitalize" />}
          >
            {side}
          </SheetTrigger>
          <SheetContent
            side={side}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <SheetTitle>What's new</SheetTitle>
              <SheetDescription>
                Version 2.4, released this week.
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {NOTES.map((paragraph) => (
                <p key={paragraph} className="mb-2 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
