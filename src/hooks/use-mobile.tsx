
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Matches with Tailwind's md breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // For debugging
  React.useEffect(() => {
    console.log("Is mobile view:", isMobile)
  }, [isMobile])

  return isMobile
}
