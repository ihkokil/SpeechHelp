
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
    // Always scroll to top when pricing link is clicked, regardless of current page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onItemClick) onItemClick();
  };

  const navigateToSectionFromOtherPage = (sectionId: string) => {
    // Store the section target in sessionStorage, so the homepage can scroll to it on load
    sessionStorage.setItem('scrollTarget', sectionId);
    // If onItemClick is provided (for mobile menu closure, etc.), call it
    if (onItemClick) onItemClick();
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

  // On other pages, use links with sessionStorage for section targeting
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
        to="/"
        className={className}
        onClick={() => navigateToSectionFromOtherPage('features')}
      >
        <Translate text="nav.features" />
      </Link>
      <Link
        to="/"
        className={className}
        onClick={() => navigateToSectionFromOtherPage('how-it-works')}
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
        to="/"
        className={className}
        onClick={() => navigateToSectionFromOtherPage('contact')}
      >
        <Translate text="nav.contact" />
      </Link>
    </>
  );
};

export default NavLinks;
