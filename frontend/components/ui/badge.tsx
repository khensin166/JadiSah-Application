import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-champagne-soft text-champagne-dark border border-champagne-light shadow-2xs",
        charcoal:
          "bg-charcoal-900 text-ivory-50 shadow-xs",
        secondary:
          "bg-ivory-100 text-charcoal-700 border border-champagne-light/70",
        destructive:
          "bg-charcoal-100 text-charcoal-700 border border-charcoal-200",
        outline:
          "text-charcoal-700 border border-champagne-light bg-ivory-50",
        success:
          "bg-sage-soft text-sage-dark border border-sage/20",
        warning:
          "bg-champagne-soft text-champagne-dark border border-champagne-light",
        rose:
          "bg-blush-soft text-charcoal-800 border border-blush/40",
        champagne:
          "bg-champagne-soft text-champagne-dark border border-champagne-light",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
