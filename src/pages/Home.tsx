import { useState } from 'react';
import { CarGrid } from '../components/CarGrid';
import { useCars } from '../hooks/useCars';

const LINEUPS = [
  { value: null, label: 'All Lineups' },
  { value: 'Mainline', label: 'Mainline' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Base', label: 'Base' },
  { value: 'RLC', label: 'RLC' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Car Culture', label: 'Car Culture' },
  { value: 'Monster Jam', label: 'Monster Jam' },
  { value: 'Fast & Furious', label: 'Fast & Furious' },
];

const TYPES = [
  { value: null, label: 'All Types' },
  { value: 'Muscle', label: 'Muscle' },
  { value: 'Sports Car', label: 'Sports Car' },
  { value: 'Supercar', label: 'Supercar' },
  { value: 'Truck', label: 'Truck' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Sedan', label: 'Sedan' },
];

export function Home() {
  const { cars, loading } = useCars();
  const [activeLineup, setActiveLineup] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const upcomingCars = cars.filter(
    (c) =>
      c.availability === 'Upcoming' &&
      (activeLineup === null || c.series === activeLineup) &&
      (activeType === null || c.type === activeType),
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="hw-hero animate-fade-in-up">
        <div className="hw-hero-content">
          <h1 className="hw-hero-title">Explore Hot Wheels Releases</h1>
          <p className="hw-hero-subtitle">
            Your guide to upcoming Hot Wheels drops — all upcoming cars in one place.
          </p>
        </div>
      </div>

      {/* Filter dropdowns */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="hw-filters-bar">
          <div className="hw-dropdown-wrapper relative">
            <label className="hw-dropdown-label">Lineup:</label>
            <select
              className="hw-dropdown-select"
              value={activeLineup ?? ''}
              onChange={(e) => setActiveLineup(e.target.value || null)}
            >
              {LINEUPS.map((l) => (
                <option key={l.value} value={l.value ?? ''}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hw-dropdown-wrapper relative">
            <label className="hw-dropdown-label">Type:</label>
            <select
              className="hw-dropdown-select"
              value={activeType ?? ''}
              onChange={(e) => setActiveType(e.target.value || null)}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value ?? ''}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upcoming releases (exclusively upcoming on home) */}
      <section className="hw-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="hw-section-header">
          <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="hw-section-title">
            {activeLineup ? `${activeLineup} — ` : ''}
            {activeType ? `${activeType} — ` : ''}
            Upcoming Releases
          </h2>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            Loading upcoming releases…
          </div>
        ) : upcomingCars.length > 0 ? (
          <CarGrid cars={upcomingCars} />
        ) : (
          <div className="hw-empty">
            <p>
              {activeLineup || activeType
                ? `No upcoming ${activeLineup || ''}${activeLineup && activeType ? ' ' : ''}${activeType} releases at the moment.`
                : 'No upcoming releases at the moment.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
