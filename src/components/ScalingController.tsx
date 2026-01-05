import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScalingController - Disabled
 * 
 * Previously applied body-level CSS transform scaling for ultra-wide displays.
 * This approach caused layout issues on 27" iMac and other large screens.
 * 
 * Responsive design is now handled via:
 * - max-w-7xl containers
 * - CSS clamp() for fluid typography
 * - Tailwind responsive breakpoints
 */
const ScalingController = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure no transform scaling is applied
    document.body.style.transform = '';
  }, [location.pathname]);

  return null;
};

export default ScalingController;
