import { InboxIcon } from "lucide-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemVariant() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item>
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Default variant</ItemTitle>
          <ItemDescription>
            Transparent background with no border.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Outline variant</ItemTitle>
          <ItemDescription>
            Outlined style with a visible border.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Muted variant</ItemTitle>
          <ItemDescription>
            Muted background for secondary content.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
