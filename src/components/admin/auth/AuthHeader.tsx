
import { Shield } from 'lucide-react';
import speechHelpLogo from '/public/lovable-uploads/1bd4b0c7-938e-4528-a6b1-ebdfd0ced505.png';

interface AuthHeaderProps {
  showLogo?: boolean;
}

const AuthHeader = ({ showLogo = false }: AuthHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      {showLogo ? (
        <div className="flex justify-center mb-4">
          <img src={speechHelpLogo} alt="SpeechHelp Logo" className="h-12" />
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
