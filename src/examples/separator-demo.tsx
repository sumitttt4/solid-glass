import { Separator } from "@/components/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          The foundation for your design system
        </div>
      </div>
      <Separator />
      <div>
        Open components you copy into your project, then change as you like.
      </div>
    </div>
  )
}
