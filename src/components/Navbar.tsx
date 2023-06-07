
import { Link } from "react-router-dom";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import DesktopNav from "./navigation/DesktopNav";
import MobileNav from "./navigation/MobileNav";

// Import the logo directly to ensure it's properly bundled with the application
import logoSvg from "../assets/logo.svg";

const Navbar = () => {
  const isScrolled = useScrollDetection();
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-md shadow-md py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={logoSvg}
              alt="SpeechHelp Logo" 
              className="h-10" 
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
