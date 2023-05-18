
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchIcon } from 'lucide-react';
import Translate from '@/components/Translate';

export type SortOption = 'newest' | 'oldest' | 'title';
export type FilterOption = 'all' | 'wedding' | 'business' | 'eulogy' | 'graduation' | 'other';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterOption;
  setFilterType: (type: FilterOption) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy
}: FilterBarProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Label htmlFor="search-speeches" className="mb-1 block text-sm">
          <Translate text="common.search" fallback="Search Speeches" />
        </Label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="search-speeches"
            placeholder="Search speeches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="filter-type" className="mb-1 block text-sm">
          <Translate text="dashboard.filterByType" fallback="Filter by Type" />
        </Label>
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as FilterOption)}
        >
          <SelectTrigger id="filter-type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="eulogy">Eulogy</SelectItem>
            <SelectItem value="graduation">Graduation</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="sort-by" className="mb-1 block text-sm">
          <Translate text="dashboard.sortBy" fallback="Sort By" />
        </Label>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
