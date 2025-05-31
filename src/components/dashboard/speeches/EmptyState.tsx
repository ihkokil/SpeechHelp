
import { ButtonCustom } from '@/components/ui/button-custom';
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
          <ButtonCustom 
            variant="outline" 
            onClick={() => navigate('/speech-lab')}
          >
            <Translate text="dashboard.createNewSpeech" />
          </ButtonCustom>
        </div>
      ) : filterType !== 'all' ? (
        <div>
          <p className="text-gray-600 mb-4">
            No speeches found for the selected filter
          </p>
          <ButtonCustom 
            variant="outline" 
            onClick={() => navigate('/speech-lab')}
          >
            <Translate text="dashboard.createNewSpeech" />
          </ButtonCustom>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            <Translate text="dashboard.noSpeeches" />
          </p>
          <ButtonCustom 
            variant="outline" 
            onClick={() => navigate('/speech-lab')}
          >
            <Translate text="dashboard.createFirstSpeech" />
          </ButtonCustom>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
