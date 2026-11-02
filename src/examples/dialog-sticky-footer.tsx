import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const PRIVACY = [
  "We collect your name, email address and the content you create, plus basic usage data such as pages viewed and errors.",
  "We use this to run the service, keep it secure and fix problems. We do not sell personal data.",
  "Payment details go straight to our payment provider. We only see the last four digits of your card.",
  "Analytics are aggregated and kept for 13 months. You can opt out in Settings › Privacy.",
  "Data is stored in the EU and the US, encrypted in transit and at rest.",
  "You can download or delete your data at any time from Settings › Account.",
  "Deleted data leaves our backups within 30 days.",
  "We share data with service providers only as needed to run the product, under written agreements.",
  "If we are required by law to share data, we will tell you unless we are told not to.",
  "Questions go to privacy@example.com.",
]

export function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Privacy policy
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privacy policy</DialogTitle>
          <DialogDescription>
            What we collect and why. The buttons stay in view while you read.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {PRIVACY.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-normal">
              {paragraph}
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
