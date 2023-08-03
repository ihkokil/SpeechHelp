
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const SMALL_SCREEN_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial state based on current window width
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < MOBILE_BREAKPOINT
      const isSmallScreenView = window.innerWidth < SMALL_SCREEN_BREAKPOINT
      setIsMobile(isMobileView)
      setIsSmallScreen(isSmallScreenView)
    }
    
    // Check on mount
    checkScreenSize()
    
    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize)
    
    // Log the current state for debugging
    console.log("Is mobile:", window.innerWidth < MOBILE_BREAKPOINT, "Window width:", window.innerWidth)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return { isMobile, isSmallScreen }
}
