
import * as React from "react"

// Defining breakpoints for better responsive control
export const BREAKPOINTS = {
  MOBILE: 640,  // sm
  TABLET: 768,  // md
  LAPTOP: 1024, // lg
  DESKTOP: 1280 // xl
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.TABLET)
    }

    // Check on mount
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  })

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < BREAKPOINTS.MOBILE,
        isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.LAPTOP,
        isLaptop: width >= BREAKPOINTS.LAPTOP && width < BREAKPOINTS.DESKTOP,
        isDesktop: width >= BREAKPOINTS.DESKTOP
      })
    }

    // Check on mount
    handleResize()

    // Add event listener for window resize
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return screenSize
}
