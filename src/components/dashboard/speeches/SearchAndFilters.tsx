
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { speechTypesData } from '@/components/speech/data/speechTypesData';
import { FilterOption, SortOption } from './FilterBar';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterOption;
  setFilterType: (type: FilterOption) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy
}) => {
  const handleFilterChange = (newFilter: FilterOption) => {
    setFilterType(newFilter);
  };

  const filterOptions = [
    { value: 'all', label: 'All Speeches' },
    { value: 'upcoming', label: 'Upcoming Speeches' },
    ...speechTypesData.map(type => ({ value: type.id, label: type.label }))
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search speeches by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-3">
        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter ({filterType === 'all' ? 'All' : filterOptions.find(f => f.value === filterType)?.label})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Filter by Type</h4>
              {filterOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={filterType === option.value}
                    onCheckedChange={() => handleFilterChange(option.value as FilterOption)}
                  />
                  <label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Sort Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Sort: {sortOptions.find(s => s.value === sortBy)?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Sort by</h4>
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={sortBy === option.value}
                    onCheckedChange={() => setSortBy(option.value as SortOption)}
                  />
                  <label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchAndFilters;
