
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AuthHeaderProps {
  showLogo?: boolean;
}

const AuthHeader = ({ showLogo = false }: AuthHeaderProps) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    // In production, we'd likely use a more reliable way to reference these assets
    // This is a workaround to get the image properly loaded in development
    import('/src/assets/speech-help-logo.svg')
      .then(module => {
        setLogoSrc(module.default);
      })
      .catch(error => {
        console.error('Error loading logo:', error);
        // Fallback to the Supabase hosted logo if available
        setLogoSrc("https://yotrueuqjxmgcwlbbyps.supabase.co/storage/v1/object/public/svg_files//Speech%20Help%20Logo.svg");
      });
  }, []);

  return (
    <div className="mb-8 text-center">
      {showLogo && logoSrc ? (
        <div className="flex justify-center mb-4">
          <img src={logoSrc} alt="SpeechHelp Logo" className="h-12" />
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <Shield className="h-12 w-12 text-white" />
        </div>
      )}
      <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
      <p className="text-white/80">Secure administrative access</p>
    </div>
  );
};

export default AuthHeader;
