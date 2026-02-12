
// Centralized logo configuration
export const LOGO_CONFIG = {
  main: "/speechhelp-logo.svg",
  fallback: "/speech-help-new-logo.svg"
};

export const getLogoPath = () => {
  return LOGO_CONFIG.main;
};
