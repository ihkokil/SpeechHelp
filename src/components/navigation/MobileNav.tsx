
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";
import { Link } from "react-router-dom";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Using Supabase hosted SVG file for logo
  const logoPath = "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg";

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-between p-4">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoPath} alt="Speech Help" className="h-8" />
        </Link>
        
        <div className="flex items-center space-x-4">
          <UserMenu />
          <LanguageSelector />
          <button
            onClick={toggleMenu}
            className="text-gray-700"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <NavLinks isMobile onItemClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
