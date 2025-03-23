
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SocialLoginButtonsProps = {
  isLoading: boolean;
  className?: string;
};

const SocialLoginButtons = ({ isLoading, className = '' }: SocialLoginButtonsProps) => {
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Login failed",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialLogin('github')}
          className="bg-white"
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialLogin('google')}
          className="bg-white"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
