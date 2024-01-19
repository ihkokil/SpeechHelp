
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-[200px] pl-8 lg:w-[300px]"
      />
    </div>
  );
};

export default SearchBar;
