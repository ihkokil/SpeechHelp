
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SpeechFiltersProps {
  selectedType: string;
  selectedUser: string;
  users: Array<{ id: string; name: string; email: string }>;
  onTypeChange: (type: string) => void;
  onUserChange: (userId: string) => void;
  onClearFilters: () => void;
}

const speechTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'business', label: 'Business' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'funeral', label: 'Funeral' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'informative', label: 'Informative' },
  { value: 'entertaining', label: 'Entertaining' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'introduction', label: 'Introduction' },
  { value: 'farewell', label: 'Farewell' },
  { value: 'award', label: 'Award' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'keynote', label: 'Keynote' },
  { value: 'tedtalk', label: 'TED Talk' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const SpeechFilters: React.FC<SpeechFiltersProps> = ({
  selectedType,
  selectedUser,
  users,
  onTypeChange,
  onUserChange,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedType !== 'all' || selectedUser !== 'all';

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by speech type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {speechTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={selectedUser} onValueChange={onUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechFilters;
