
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  SidebarContext, 
  SIDEBAR_COOKIE_NAME, 
  SIDEBAR_COOKIE_MAX_AGE, 
  SIDEBAR_KEYBOARD_SHORTCUT
} from "./use-sidebar"

type SidebarProviderProps = {
  defaultOpen?: boolean
  children: React.ReactNode
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [state, setState] = React.useState<"expanded" | "collapsed">(
    defaultOpen ? "expanded" : "collapsed"
  )
  const [open, setOpen] = React.useState(defaultOpen)

  // Toggle sidebar
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((open) => !open)
      return
    }

    setOpen((open) => {
      const newState = !open

      if (typeof window !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${
          newState ? "expanded" : "collapsed"
        }; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE};`
      }

      return newState
    })
  }, [isMobile])

  // Set sidebar state
  React.useEffect(() => {
    setState(open ? "expanded" : "collapsed")
  }, [open])

  // Keyboard shortcut
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        toggleSidebar()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [toggleSidebar])

  // Cookie
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const cookies = document.cookie.split("; ")
    const sidebarCookie = cookies.find((cookie) =>
      cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`)
    )

    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split("=")[1]
      setOpen(sidebarState === "expanded")
      setState(sidebarState as "expanded" | "collapsed")
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export { SidebarProvider }
