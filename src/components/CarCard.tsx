import { Link } from 'react-router-dom';
import type { Car } from '../types/car';
import { ImageFallback } from './ImageFallback';
import { Flame, ShieldAlert } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

const availabilityConfig: Record<string, string> = {
  Upcoming: 'badge-upcoming',
  'In Stores': 'badge-in-stores',
  'Out of Production': 'bg-slate-700/20 text-slate-400 border border-slate-700',
};

export function CarCard({ car }: CarCardProps) {
  const badgeClass = availabilityConfig[car.availability] || availabilityConfig['Out of Production'];
  const releaseDate = car.releaseDate
    ? new Date(car.releaseDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  return (
    <Link to={`/car/${car.id}`} className="hw-card-link">
      <article className="hw-card animate-fade-in-up">
        <div className="relative">
          <ImageFallback
            diecast={car.images.diecast}
            realCar={car.images.realCar}
            alt={car.name}
            showDisclaimer={Boolean(car.images.realCar) && !car.images.diecast}
          />

          {car.superTreasureHunt && (
            <div className="hw-badge badge-sth absolute top-2 left-2">
              <ShieldAlert className="h-3 w-3" /> STH
            </div>
          )}
          {car.treasureHunt && !car.superTreasureHunt && (
            <div className="hw-badge badge-th absolute top-2 left-2">
              <Flame className="h-3 w-3" /> TH
            </div>
          )}

          <div className={`hw-badge ${badgeClass} absolute top-2 right-2`}>
            {car.availability}
          </div>
        </div>

        <div className="hw-card-content">
          <h3 className="hw-card-name">{car.name}</h3>
          <div className="hw-card-meta">
            <span className="series">{car.series}</span> • {car.country} • {car.yearIntroduced}
          </div>
          <p className="hw-card-date">{releaseDate}</p>
        </div>

        <div className="px-5 pb-5">
          <span className="hw-card-link-text">View details →</span>
        </div>
      </article>
    </Link>
  );
}
