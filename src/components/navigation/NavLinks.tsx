import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Translate from '@/components/Translate';

interface NavLinksProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavLinks = ({ isMobile = false, onItemClick }: NavLinksProps) => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Only attempt to scroll if we're on the homepage
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Adding offset to account for the navbar height
        const navbarHeight = 76; // Height of the navbar in pixels
        
        // Base offset calculation
        let offsetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        // Additional small offset for "How it Works" section to position it closer to navbar
        if (sectionId === 'how-it-works') {
          offsetPosition = offsetPosition - 16; // Reduce by 16px to move it closer
        }
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    if (onItemClick) onItemClick();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onItemClick) onItemClick();
  };

  const handlePricingClick = () => {
    // If already on pricing page, scroll to top
    if (location.pathname === '/pricing') {
      scrollToTop();
    }
    if (onItemClick) onItemClick();
  };

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll
      scrollToSection(sectionId);
    } else {
      // If on another page, we'll navigate to home with a hash
      if (onItemClick) onItemClick();
    }
  };

  const className = isMobile 
    ? "text-gray-700 hover:text-pink-600 font-medium transition-colors text-left" 
    : "text-gray-700 hover:text-pink-600 font-medium transition-colors";

  if (location.pathname === '/') {
    // On homepage, use smooth scrolling
    return (
      <>
        <button
          onClick={scrollToTop}
          className={className}
        >
          <Translate text="nav.home" />
        </button>
        <button
          onClick={() => scrollToSection('features')}
          className={className}
        >
          <Translate text="nav.features" />
        </button>
        <button
          onClick={() => scrollToSection('how-it-works')}
          className={className}
        >
          <Translate text="nav.howItWorks" />
        </button>
        <Link
          to="/pricing"
          className={className}
          onClick={handlePricingClick}
        >
          <Translate text="nav.pricing" />
        </Link>
        <button
          onClick={() => scrollToSection('contact')}
          className={className}
        >
          <Translate text="nav.contact" />
        </button>
      </>
    );
  }

  // On other pages, use links to homepage with hash
  return (
    <>
      <Link
        to="/"
        className={className}
        onClick={scrollToTop}
      >
        <Translate text="nav.home" />
      </Link>
      <Link
        to="/#features"
        className={className}
        onClick={onItemClick}
      >
        <Translate text="nav.features" />
      </Link>
      <Link
        to="/#how-it-works"
        className={className}
        onClick={onItemClick}
      >
        <Translate text="nav.howItWorks" />
      </Link>
      <Link
        to="/pricing"
        className={className}
        onClick={handlePricingClick}
      >
        <Translate text="nav.pricing" />
      </Link>
      <Link
        to="/#contact"
        className={className}
        onClick={onItemClick}
      >
        <Translate text="nav.contact" />
      </Link>
    </>
  );
};

export default NavLinks;
