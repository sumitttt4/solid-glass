import * as React from "react"

import { cn } from "@/lib/utils"

function PageHeader({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn(className)} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4">{children}</div>
      </div>
    </section>
  )
}

function PageHeaderHeading({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-foreground xl:text-5xl xl:tracking-tighter",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("max-w-3xl text-base text-balance text-foreground sm:text-lg", className)} {...props} />
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex w-full items-center justify-center gap-2 pt-2", className)} {...props} />
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }
