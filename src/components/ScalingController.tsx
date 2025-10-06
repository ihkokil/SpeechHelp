import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getScaleFactor, applyBodyScaling } from '@/utils/screenScaling';

const ScalingController = () => {
  const location = useLocation();

  useEffect(() => {
    const handleScaling = () => {
      const pathname = location.pathname;
      
      // Frontend routes that SHOULD be scaled
      const frontendRoutes = [
        '/',
        '/auth',
        '/pricing', 
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy',
        '/admin/auth'
      ];
      
      // Backend routes that should NOT be scaled
      const backendRoutes = [
        '/dashboard',
        '/speech-lab', 
        '/my-speeches',
        '/admin'
      ];
      
      // Check if current path starts with any backend route
      const shouldNotScale = backendRoutes.some(route => pathname.startsWith(route));
      
      // Check if current path matches any frontend route exactly
      const shouldScale = frontendRoutes.some(route => pathname === route) || pathname === '/';
      
      if (shouldNotScale) {
        // Remove scaling for backend routes
        applyBodyScaling(1);
      } else if (shouldScale) {
        // Apply scaling for frontend routes
        const scaleFactor = getScaleFactor(window.innerWidth);
        applyBodyScaling(scaleFactor);
      } else {
        // Default to no scaling for unknown routes
        applyBodyScaling(1);
      }
    };

    // Apply scaling immediately
    handleScaling();

    // Debounce resize handler
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleScaling, 100);
    };

    // Listen for window resize events
    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [location.pathname]); // Re-run when location changes

  return null; // This component doesn't render anything
};

export default ScalingController;