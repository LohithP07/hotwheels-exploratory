import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleSearch(e as unknown as React.FormEvent);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="hw-search-popup animate-slide-down"
      role="search"
      aria-label="Search cars"
      onClick={handleClickOutside}
    >
      <div className="hw-search-popup-inner">
        <Search className="hw-search-icon-abs" />
        <input
          type="text"
          className="hw-search-input"
          placeholder="Search Hot Wheels cars..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
