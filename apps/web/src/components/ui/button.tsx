import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wide transition-all active:duration-75 focus-visible:outline-none disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-500 border-2 border-b-4 border-slate-200 hover:bg-slate-50 active:border-b-0 active:translate-y-[2px]",
        primary:
          "bg-[#58cc02] text-white border-b-4 border-primary-depth hover:bg-[#61e002] active:border-b-0 active:translate-y-[2px]",
        secondary:
          "bg-[#1cb0f6] text-white border-b-4 border-secondary-depth hover:bg-[#20c4ff] active:border-b-0 active:translate-y-[2px]",
        danger:
          "bg-[#ff4b4b] text-white border-b-4 border-danger-depth hover:bg-[#ff5f5f] active:border-b-0 active:translate-y-[2px]",
        super:
          "bg-[#ce82ff] text-white border-b-4 border-super-depth hover:bg-[#d794ff] active:border-b-0 active:translate-y-[2px]",
        ghost: "bg-transparent text-slate-500 border-none hover:bg-slate-100 active:translate-y-0",
        highlight:
          "bg-highlight text-white border-b-4 border-highlight-depth hover:bg-highlight/90 active:border-b-0 active:translate-y-[2px]",

        golden:
          "bg-golden text-white border-b-4 border-golden-depth hover:bg-golden/90 active:border-b-0 active:translate-y-[2px]",

        locked:
          "bg-[#e5e5e5] text-[#afafaf] border-b-4 border-[#afafaf] cursor-not-allowed active:translate-y-0",

        immersive:
          "bg-white/20 text-white border-2 border-b-4 border-white/40 hover:bg-white/30 active:border-b-0 active:translate-y-[2px]",

        active:
          "bg-[#ddf4ff] text-[#1cb0f6] border-2 border-b-4 border-[#1cb0f6] hover:bg-[#c6ecff] active:border-b-0 active:translate-y-[2px]",

        correct:
          "bg-[#d7ffb8] text-[#58cc02] border-2 border-b-4 border-[#58cc02] hover:bg-[#c6f7a1] active:border-b-0 active:translate-y-[2px]",

        incorrect:
          "bg-[#ffdfe0] active:animate-shake text-[#ea2b2b] border-2 border-b-4 border-[#ea2b2b] hover:bg-[#ffcfd1] active:border-b-0 active:translate-y-[2px]",
        select:
          " bg-gray-50 border-2 border-b-4 border-transparent hover:bg-gray-100 data-[selected=true]:border-green-500  transition-all",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 px-3 text-xs",
        lg: "h-[52px] px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "danger"
    | "super"
    | "highlight"
    | "golden"
    | "locked"
    | "ghost"
    | "immersive"
    | "active"
    | "correct"
    | "incorrect"
    | "select"
    | null
    | undefined;
  size?: VariantProps<typeof buttonVariants>["size"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
