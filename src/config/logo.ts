
// Centralized logo configuration
export const LOGO_CONFIG = {
  main: "/speech-help-new-logo.svg",
  fallback: "https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/images//SpeechHelp_Logo.svg"
};

export const getLogoPath = () => {
  return LOGO_CONFIG.main;
};
