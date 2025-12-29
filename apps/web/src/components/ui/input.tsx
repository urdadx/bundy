import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full group">
      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          // 1. Base Styles: Chunky and Rounded
          "w-full rounded-2xl border-2 border-b-4 border-slate-200 bg-slate-100/50 px-4 py-3",
          "text-base font-bold text-slate-700 placeholder:text-slate-400 outline-none transition-all",

          // 2. The "Inset" Effect: A subtle top border to simulate depth
          "border-t-slate-300",

          // 3. Focus State: Switch to brand blue
          "focus:bg-white focus:border-input-focus focus:border-b-input-focus ring-0",

          // 4. Disabled State
          "disabled:opacity-50 disabled:bg-neutral-100 disabled:cursor-not-allowed",

          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }