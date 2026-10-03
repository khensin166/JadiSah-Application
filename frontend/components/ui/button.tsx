import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-champagne text-charcoal-900 font-semibold shadow-xs hover:bg-champagne-light border border-champagne-dark/20",
        charcoal:
          "bg-charcoal-900 text-ivory-50 shadow-xs hover:bg-charcoal-800",
        destructive:
          "bg-red-700 text-white shadow-xs hover:bg-red-800",
        outline:
          "border border-champagne-light bg-ivory-50 text-charcoal-700 shadow-2xs hover:bg-champagne-soft hover:text-charcoal-900",
        secondary:
          "bg-ivory-200 text-charcoal-800 hover:bg-ivory-300",
        ghost: "text-charcoal-600 hover:bg-ivory-200/60 hover:text-charcoal-900",
        link: "text-champagne-dark underline-offset-4 hover:underline",
        champagne: "bg-champagne text-charcoal-900 font-semibold hover:bg-champagne-light shadow-xs border border-champagne-dark/20",
        rose: "bg-blush-soft text-charcoal-800 border border-blush/60 hover:bg-blush/20",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-5 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
