import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface NavbarProps {
  carCount: number;
}

export function Navbar({ carCount }: NavbarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="hw-nav">
      <div className="hw-container hw-nav-inner">
        {/* Left: Car count */}
        <div className="hw-car-count">
          Cars Added: {carCount}
        </div>

        {/* Center: Logo Only */}
        <div className="hw-logo-center">
          <div
            className="hw-logo"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogoClick();
            }}
          >
            <div className="hw-logo-box">HW</div>
          </div>
        </div>

        {/* Right: Search Bar - Uniform inline */}
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              className="hw-search-input w-full"
              placeholder="Search cars..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Submit search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
