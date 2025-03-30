
import { Shield } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <Shield className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white">SpeechHelp Admin</h1>
      <p className="text-white/80">Secure administrative access</p>
    </div>
  );
};

export default AuthHeader;
