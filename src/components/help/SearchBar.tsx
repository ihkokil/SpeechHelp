
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <Button type="submit" variant="magenta" className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
