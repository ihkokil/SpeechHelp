
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
        
        // Get the position of the element
        let offsetPosition = element.getBoundingClientRect().top + window.scrollY;
        
        // For "How it Works" section, use a different offset to position it at the very top
        if (sectionId === 'how-it-works') {
          offsetPosition = offsetPosition - 10; // Minimal offset to put header at very top
        } else if (sectionId === 'contact') {
          offsetPosition = offsetPosition - navbarHeight; // Position the contact header at the top
        } else {
          // For other sections, apply the standard offset
          offsetPosition = offsetPosition - navbarHeight;
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
    // If already on pricing page, scroll to top with no offset
    if (location.pathname === '/pricing') {
      // Scroll to the top with enough space to see the header
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onItemClick) onItemClick();
  };

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on homepage, just scroll
      scrollToSection(sectionId);
    } else {
      // If on another page (like pricing), store the target section in sessionStorage
      sessionStorage.setItem('scrollTarget', sectionId);
      // Navigation will happen through the Link component
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

  // On other pages (like pricing), use links to homepage with section handling
  return (
    <>
      <Link
        to="/"
        className={className}
        onClick={scrollToTop}
      >
        <Translate text="nav.home" />
      </Link>
      <button
        onClick={() => handleNavigation('features')}
        className={className}
      >
        <Translate text="nav.features" />
      </button>
      <button
        onClick={() => handleNavigation('how-it-works')}
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
        onClick={() => handleNavigation('contact')}
        className={className}
      >
        <Translate text="nav.contact" />
      </button>
    </>
  );
};

export default NavLinks;
