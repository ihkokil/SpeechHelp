// Dynamic screen scaling utility for ultra-wide displays
// Targets 80% of screen width with minimum activation at 2000px

const TARGET_WIDTH_PERCENTAGE = 0.8;
const MIN_ACTIVATION_WIDTH = 2000;
const BASE_WIDTH = 1600;

/**
 * Calculate scale factor based on screen width
 * @param screenWidth - Current screen width in pixels
 * @returns Scale factor (1 = no scaling, >1 = zoom in)
 */
export function getScaleFactor(screenWidth: number): number {
  if (screenWidth <= MIN_ACTIVATION_WIDTH) {
    return 1; // No scaling for screens <= 2000px
  }
  
  // Calculate scale to use 80% of screen width
  const targetWidth = screenWidth * TARGET_WIDTH_PERCENTAGE;
  const scaleFactor = targetWidth / BASE_WIDTH;
  
  // Cap maximum scale to prevent excessive zooming
  return Math.min(scaleFactor, 2.5);
}

/**
 * Apply scaling to the document body
 * @param scaleFactor - Scale factor to apply
 */
export function applyBodyScaling(scaleFactor: number): void {
  const body = document.body;
  
  if (scaleFactor === 1) {
    // Remove scaling
    body.style.transform = '';
  } else {
    // Apply scaling
    body.style.transform = `scale(${scaleFactor})`;
  }
}

/**
 * Check if current route should have scaling applied
 */
function shouldApplyScaling(): boolean {
  const pathname = window.location.pathname;
  
  // Backend routes that should NOT be scaled
  const backendRoutes = [
    '/dashboard',
    '/speech-lab', 
    '/my-speeches',
    '/writing-tips',
    '/help',
    '/settings',
    '/admin'
  ];
  
  // Check if current path starts with any backend route
  return !backendRoutes.some(route => pathname.startsWith(route));
}

/**
 * Initialize dynamic scaling system
 */
export function initializeScaling(): void {
  // Apply initial scaling
  const handleResize = () => {
    if (shouldApplyScaling()) {
      const scaleFactor = getScaleFactor(window.innerWidth);
      applyBodyScaling(scaleFactor);
    } else {
      // Remove scaling for backend routes
      applyBodyScaling(1);
    }
  };
  
  // Debounce resize handler
  let resizeTimeout: NodeJS.Timeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  };
  
  // Initial application
  handleResize();
  
  // Listen for resize events
  window.addEventListener('resize', debouncedResize);
  
  // Listen for route changes (for SPA navigation)
  window.addEventListener('popstate', debouncedResize);
}