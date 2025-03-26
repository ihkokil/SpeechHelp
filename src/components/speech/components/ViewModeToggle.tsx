
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Edit, Eye } from 'lucide-react';
import Translate from '@/components/Translate';

interface ViewModeToggleProps {
  viewMode: 'edit' | 'preview';
  onViewModeChange: (value: 'edit' | 'preview') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode} 
      onValueChange={(value) => value && onViewModeChange(value as 'edit' | 'preview')}
    >
      <ToggleGroupItem value="edit" aria-label="Edit mode" className="px-3 py-1">
        <Edit className="h-5 w-5 mr-1" />
        <Translate text="speechLab.edit" fallback="Edit" />
      </ToggleGroupItem>
      <ToggleGroupItem value="preview" aria-label="Preview mode" className="px-3 py-1">
        <Eye className="h-5 w-5 mr-1" />
        <Translate text="speechLab.preview" fallback="Preview" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewModeToggle;
