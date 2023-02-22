
import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface TextareaWithPinkScrollbarProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextareaWithPinkScrollbar = React.forwardRef<HTMLTextAreaElement, TextareaWithPinkScrollbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-pink-400 [&::-webkit-scrollbar-track]:bg-transparent",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
TextareaWithPinkScrollbar.displayName = "TextareaWithPinkScrollbar"

export { TextareaWithPinkScrollbar }
