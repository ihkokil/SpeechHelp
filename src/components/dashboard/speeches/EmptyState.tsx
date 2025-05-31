
import { Button } from '@/components/ui/button'; 
import { useNavigate } from 'react-router-dom';
import { FilterOption } from './FilterBar';
import Translate from '@/components/Translate';

interface EmptyStateProps {
  searchQuery: string;
  filterType: FilterOption;
}

const EmptyState = ({ searchQuery, filterType }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-4">
      {searchQuery ? (
        <div>
          <p className="text-gray-600 mb-4">No speeches found matching "{searchQuery}"</p>
          <Button 
            onClick={() => navigate('/speech-lab')}
            className="h-10 px-6 py-2 border border-pink-500 text-white hover:bg-pink-50 hover:text-pink-500 transition-colors rounded-md"
          >
            <Translate text="dashboard.createNewSpeech" />
          </Button>
        </div>
      ) : filterType !== 'all' ? (
        <div>
          <p className="text-gray-600 mb-4">
            No speeches found for the selected filter
          </p>
          <Button 
            onClick={() => navigate('/speech-lab')}
            className="h-10 px-6 py-2 border border-pink-500 text-white hover:bg-pink-50 hover:text-pink-500 transition-colors rounded-md"
          >
            <Translate text="dashboard.createNewSpeech" />
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            <Translate text="dashboard.noSpeeches" />
          </p>
          <Button 
            onClick={() => navigate('/speech-lab')}
            className="h-10 px-6 py-2 border border-pink-500 text-white hover:bg-pink-50 hover:text-pink-500 transition-colors rounded-md"
          >
            <Translate text="dashboard.createFirstSpeech" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
