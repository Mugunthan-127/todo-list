
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useTaskContext();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search tasks..."
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
