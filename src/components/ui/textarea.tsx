import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full resize-none rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-3 text-[13px] leading-relaxed text-white outline-none placeholder:text-[#7C838C] focus:border-[#52525B] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
