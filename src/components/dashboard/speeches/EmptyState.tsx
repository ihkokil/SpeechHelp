
import { SearchIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FilterOption } from './FilterBar';

export interface EmptyStateProps {
  searchQuery: string;
  filterType: FilterOption;
}

const EmptyState = ({ searchQuery, filterType }: EmptyStateProps) => {
  const navigate = useNavigate();
  
  const getMessage = () => {
    if (searchQuery && filterType !== 'all') {
      return `No speeches found matching "${searchQuery}" with the selected type.`;
    } else if (searchQuery) {
      return `No speeches found matching "${searchQuery}".`;
    } else if (filterType !== 'all') {
      return `No speeches found with the selected type.`;
    } else {
      return "You haven't created any speeches yet.";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-gray-50 text-center">
      {searchQuery || filterType !== 'all' ? (
        <div className="bg-yellow-100 rounded-full p-3 mb-4">
          <SearchIcon className="h-6 w-6 text-yellow-500" />
        </div>
      ) : (
        <div className="bg-blue-100 rounded-full p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-blue-500" />
        </div>
      )}
      
      <h3 className="mt-2 text-lg font-semibold text-gray-900">{getMessage()}</h3>
      
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        {searchQuery || filterType !== 'all' 
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'Create your first speech to get started with SpeechHelp.'}
      </p>
      
      {!searchQuery && filterType === 'all' && (
        <Button
          className="mt-6"
          onClick={() => navigate('/speech-lab')}
        >
          Create New Speech
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
