
import React from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';

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
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <Input
        placeholder="Search for help topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <ButtonCustom type="submit" variant="premium" className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Search
      </ButtonCustom>
    </form>
  );
};

export default SearchBar;
