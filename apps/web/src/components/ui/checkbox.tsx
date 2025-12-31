import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // The Box: Sunken/Inset look
        "flex size-6 items-center justify-center rounded-lg border-2 border-t-slate-300 border-x-slate-200 border-b-slate-100 bg-slate-100",
        "data-checked:bg-green-500 data-checked:border-green-600",
        "transition-all outline-none focus-visible:ring-2 focus-visible:ring-green-500/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="text-white transition-all data-open:scale-110 data-closed:scale-0"
      >
        <CheckIcon strokeWidth={4} className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
