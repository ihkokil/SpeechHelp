
// Centralized logo configuration
export const LOGO_CONFIG = {
  main: "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg",
  fallback: "/speech-help-new-logo.svg"
};

export const getLogoPath = () => {
  return LOGO_CONFIG.main;
};
