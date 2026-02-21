import { Search, X } from 'lucide-react';
import { usePrompts } from '../../context/PromptContext';
import './SearchBar.css';

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = usePrompts();

  return (
    <div className="search-bar">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        placeholder="Search prompts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button
          className="search-clear"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
