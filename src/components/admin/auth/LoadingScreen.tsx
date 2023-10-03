
import { Shield } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      <div className="text-center text-white">
        <Shield className="h-12 w-12 mx-auto animate-pulse mb-4" />
        <h2 className="text-xl font-semibold">Checking configuration...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
