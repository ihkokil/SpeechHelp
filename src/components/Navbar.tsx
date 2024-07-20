
import { Link, useLocation } from "react-router-dom";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopNav from "./navigation/DesktopNav";
import MobileNav from "./navigation/MobileNav";

const Navbar = () => {
  const isScrolled = useScrollDetection();
  const location = useLocation();
  const isMobile = useIsMobile();

  // List of routes where we don't want to show the navbar because they use the sidebar
  const sidebarRoutes = ['/speech-lab', '/settings', '/help', '/my-speeches', '/writing-tips', '/dashboard', '/subscription'];
  
  // Check if current route should use sidebar instead of navbar
  const usesSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route));
  
  // If current route uses sidebar, don't render the navbar
  if (usesSidebar) return null;
  
  // Using the SVG logo file for better visibility and sharpness
  const logoPath = "/speech-help-new-logo.svg";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-white py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={logoPath}
              alt="SpeechHelp Logo" 
              className={`${isMobile ? "h-10" : "h-12"} w-auto`}
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
