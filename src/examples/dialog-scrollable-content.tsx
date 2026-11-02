import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const TERMS = [
  "These terms cover your use of the workspace, the apps that connect to it and any content you add.",
  "You keep ownership of everything you upload. You give us permission to store and process it only to run the service for you.",
  "Keep your password private and turn on two-factor sign-in. You are responsible for activity under your account.",
  "Paid plans renew each month or year until you cancel. Cancelling stops the next charge; it does not refund the current period.",
  "We may change features with notice. If a change removes something you rely on, you can export your data and leave.",
  "Do not use the service to send spam, break the law or get around usage limits.",
  "We can suspend an account that puts other customers at risk, and will tell you why when we can.",
  "The service is provided as is. Our liability is limited to what you paid in the last twelve months.",
  "We will email you before these terms change. Continuing to use the service after that means you accept the new terms.",
  "Questions about these terms go to legal@example.com.",
]

export function DialogScrollableContent() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Terms of service
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>
            Last updated 12 March. The text scrolls; the header stays put.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {TERMS.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-normal">
              {paragraph}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
