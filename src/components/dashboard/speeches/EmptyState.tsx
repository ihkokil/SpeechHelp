
import { ButtonCustom } from '@/components/ui/button-custom';
import Translate from '@/components/Translate';

interface EmptyStateProps {
  onClearFilters: () => void;
  hasFilters: boolean;
}

const EmptyState = ({ onClearFilters, hasFilters }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 border rounded-md bg-gray-50">
      <p className="text-gray-500 mb-2">
        <Translate text="dashboard.noSpeechesFound" fallback="No speeches found" />
      </p>
      <p className="text-gray-400 text-sm mb-4">
        <Translate 
          text="dashboard.adjustFiltersHint" 
          fallback="Try adjusting your search or filters" 
        />
      </p>
      {hasFilters && (
        <ButtonCustom 
          variant="outline" 
          onClick={onClearFilters}
        >
          <Translate text="dashboard.clearFilters" fallback="Clear Filters" />
        </ButtonCustom>
      )}
    </div>
  );
};

export default EmptyState;
