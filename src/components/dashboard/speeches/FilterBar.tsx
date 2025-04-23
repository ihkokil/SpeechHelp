
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { speechTypesData } from '@/components/speech/data/speechTypesData';

export type FilterOption = 'all' | 'upcoming' | string;
export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterOption;
  setFilterType: (type: FilterOption) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
}: FilterBarProps) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search speeches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Filter by Type */}
          <div className="w-full">
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FilterOption)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectGroup>
                  <SelectLabel>Filter Options</SelectLabel>
                  <SelectItem value="all">All Speeches</SelectItem>
                  <SelectItem value="upcoming">Upcoming Speeches</SelectItem>
                </SelectGroup>
                
                <SelectGroup>
                  <SelectLabel>Speech Types</SelectLabel>
                  {speechTypesData.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort */}
          <div className="w-full">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
