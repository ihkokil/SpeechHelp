
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-pink-500 text-white shadow-sm hover:bg-pink-600",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
        outline:
          "border border-pink-500 bg-background shadow-sm hover:bg-pink-50 text-pink-500",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:opacity-90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-pink-600 hover:text-pink-800 font-medium underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm hover:shadow-md hover:opacity-95 transition-all",
        pink: "bg-pink-500 text-white shadow-sm hover:bg-pink-600 transition-all",
        minimal: "bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow hover:border-gray-300 transition-all",
        subtle: "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-all",
        magenta: "bg-pink-500 text-white rounded-md shadow-sm hover:bg-pink-600 transition-all px-8 font-semibold",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
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

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom, buttonVariants };
