
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';
import { Speech } from '@/types/auth';

interface SpeechesLoaderProps {
  speeches: Speech[] | null;
  isLoading: boolean;
  fetchSpeeches: () => Promise<void>;
  onCreateNewSpeech: () => void;
  renderTable: () => React.ReactNode;
}

const SpeechesLoader = ({ 
  speeches, 
  isLoading, 
  fetchSpeeches, 
  onCreateNewSpeech,
  renderTable
}: SpeechesLoaderProps) => {
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const { toast } = useToast();

  // Make sure speeches are loaded when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadSpeeches = async () => {
      if (!componentLoaded && isMounted) {
        console.log("PreviousSpeeches component mounted, fetching speeches");
        setIsLoadingSpeeches(true);
        
        try {
          await fetchSpeeches();
        } catch (error) {
          console.error("Error fetching speeches in PreviousSpeeches:", error);
          if (isMounted) {
            toast({
              title: "Error loading speeches",
              description: "We couldn't load your speeches. Please try again.",
              variant: "destructive"
            });
          }
        } finally {
          if (isMounted) {
            setIsLoadingSpeeches(false);
            setComponentLoaded(true);
          }
        }
      }
    };
    
    // Only try to fetch if we're not already loading
    if (!isLoading) {
      loadSpeeches();
    }
    
    return () => {
      isMounted = false;
    };
  }, [fetchSpeeches, componentLoaded, isLoading, toast]);

  // Debug speeches data
  useEffect(() => {
    console.log("Speeches data in SpeechesLoader:", speeches);
  }, [speeches]);

  if (isLoading || isLoadingSpeeches) {
    return (
      <div className="p-4">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
      </div>
    );
  }

  if (!speeches || speeches.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4"><Translate text="dashboard.noSpeeches" /></p>
        <ButtonCustom 
          variant="outline" 
          onClick={onCreateNewSpeech}
        >
          <Translate text="dashboard.createFirstSpeech" />
        </ButtonCustom>
      </div>
    );
  }

  return renderTable();
};

export default SpeechesLoader;
