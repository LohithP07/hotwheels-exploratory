import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export function SearchBar({ placeholder = 'Search Hot Wheels cars...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          className="hw-search-input w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
