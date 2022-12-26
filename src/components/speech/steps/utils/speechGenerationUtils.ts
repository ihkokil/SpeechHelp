
import { useToast } from '@/hooks/use-toast';

export const validateSpeechInput = (title: string) => {
  const { toast } = useToast();
  
  if (!title.trim()) {
    toast({
      title: "Title Required",
      description: "Please enter a title for your speech",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};

export const simulateSpeechGeneration = (
  title: string, 
  formData: Record<string, string>, 
  callback: () => void,
  errorCallback: () => void
) => {
  // Simulate API call or processing time
  const updatedFormData = { ...formData };
  updatedFormData["speechTitle"] = title;
  
  // Return the updated form data and trigger callback after "generation"
  setTimeout(() => {
    callback();
    
    // Navigate to next step after showing congratulations for 6 seconds
    setTimeout(() => {
      errorCallback();
    }, 6000);
  }, 1500);
  
  return updatedFormData;
};
