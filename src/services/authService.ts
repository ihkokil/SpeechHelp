
import { supabase } from '@/integrations/supabase/client';
import { ToastProps } from '@/hooks/use-toast';

// Create a type for the showToast function that will be passed in
type ShowToastFunction = (props: ToastProps) => void;

// Service functions now accept toast function as a parameter
export const signIn = async (email: string, password: string, showToast: ShowToastFunction) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    showToast({
      title: "Login failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  showToast({
    title: "Login successful",
    description: "Welcome back!",
  });
};

export const signUp = async (
  email: string, 
  password: string, 
  showToast: ShowToastFunction,
  firstName?: string, 
  lastName?: string
) => {
  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  });
  
  if (error) {
    showToast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  showToast({
    title: "Sign up successful",
    description: "Welcome to SpeechHelp! Please check your email to confirm your account.",
  });
};

export const signOut = async (showToast: ShowToastFunction) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    showToast({
      title: "Sign out failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  showToast({
    title: "Signed out",
    description: "You have been signed out successfully.",
  });
};
