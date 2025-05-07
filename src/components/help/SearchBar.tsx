
import React from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the help database
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        placeholder="Search for help topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <button 
        type="submit" 
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#b84c9f] px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a3428e] transition-all"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
