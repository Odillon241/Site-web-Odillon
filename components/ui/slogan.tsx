import { PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface SloganProps {
  className?: string;
}

export function Slogan({ className }: SloganProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center gap-2 text-odillon-teal font-baskvill h-8 md:h-10 lg:h-12 text-2xl md:text-3xl lg:text-4xl whitespace-nowrap", 
        className
      )}
    >
      <span>Together we draw</span>
      <PenLine className="w-[1em] h-[1em]" aria-hidden="true" strokeWidth={2} />
      <span>the future</span>
    </div>
  )
}
