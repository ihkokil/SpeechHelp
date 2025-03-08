
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TwoFactorState {
  isEnabled: boolean;
  isLoading: boolean;
}

export const useTwoFactorAuth = () => {
  const { user } = useAuth();
  const [state, setState] = useState<TwoFactorState>({
    isEnabled: false,
    isLoading: true
  });

  const fetchTwoFactorStatus = async () => {
    if (!user) {
      setState({ isEnabled: false, isLoading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('is_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching 2FA status:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setState({
        isEnabled: data?.is_enabled || false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchTwoFactorStatus();
  }, [user]);

  return {
    ...state,
    refetch: fetchTwoFactorStatus
  };
};
