
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthUrlHandlerProps = {
  onSetSignUp: (value: boolean) => void;
  onSetResetPassword: (value: boolean) => void;
};

const AuthUrlHandler: React.FC<AuthUrlHandlerProps> = ({ 
  onSetSignUp, 
  onSetResetPassword 
}) => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      onSetSignUp(true);
    }

    // Handle social login redirects and password recovery
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        onSetResetPassword(true);
      }
      
      // Check if this is a redirect after social login
      if (hashParams.get('access_token')) {
        toast({
          title: "Authentication successful",
          description: "You have successfully logged in.",
        });
      }
    }
    
    // Handle refresh token errors
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');
    if (errorParam && errorDescription) {
      toast({
        title: "Authentication error",
        description: errorDescription,
        variant: "destructive"
      });
    }
  }, [location, toast, onSetSignUp, onSetResetPassword]);

  return null;
};

export default AuthUrlHandler;
