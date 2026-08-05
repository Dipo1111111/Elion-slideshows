import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-lg border border-[#1F212B] bg-[#08080A] px-3.5 py-2.5 text-[13px] text-white outline-none placeholder:text-[#7C838C] focus:border-[#52525B] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
