import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CarGrid } from '../components/CarGrid';
import type { Car } from '../types/car';
import { useCars } from '../hooks/useCars';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { cars, loading, error, refetch } = useCars();
  const [filtered, setFiltered] = useState<Car[]>([]);

  useEffect(() => {
    if (!loading && cars.length > 0) {
      if (query.trim()) {
        const lower = query.toLowerCase();
        setFiltered(
          cars.filter(
            (c) =>
              c.name.toLowerCase().includes(lower) ||
              c.castingName.toLowerCase().includes(lower) ||
              c.series.toLowerCase().includes(lower) ||
              c.origin.toLowerCase().includes(lower) ||
              c.country.toLowerCase().includes(lower),
          ),
        );
      } else {
        setFiltered(cars);
      }
    }
  }, [cars, loading, query]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Searching…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Failed to load</h2>
        <p className="text-slate-400 mb-6">{error.message}</p>
        <button onClick={() => refetch()} className="hw-btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="hw-container py-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="text-slate-400 hover:text-white transition-colors p-2"
          aria-label="Go back"
        >
          <span className="sr-only">Back</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-100">Search Cars</h1>
      </div>

      <div className="mb-8">
        <p className="text-sm text-slate-400 mb-2">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for{" "}
          <span className="font-medium text-slate-100">"{query}"</span>
        </p>
        <CarGrid cars={filtered} />
      </div>
    </div>
  );
}
