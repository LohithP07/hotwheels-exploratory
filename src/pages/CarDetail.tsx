import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Car } from '../types/car';
import { ImageFallback } from '../components/ImageFallback';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Flame,
  ShieldAlert,
  Link as LinkIcon,
  Truck,
  Layout,
} from 'lucide-react';
import { useCars } from '../hooks/useCars';

export function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading, error, refetch } = useCars();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    if (!loading && cars.length > 0) {
      const found = cars.find((c) => c.id === id);
      setCar(found || null);
    }
  }, [cars, loading, id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading car details…
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Failed to load</h2>
        <p className="text-slate-400 mb-6">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="hw-btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Car not found</h2>
        <p className="text-slate-400 mb-6">The car you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="hw-btn-primary"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
        </button>
      </div>
    );
  }

  const releaseDate = car.releaseDate
    ? new Date(car.releaseDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'To be announced';

  const availabilityConfig: Record<string, string> = {
    Upcoming: 'badge-upcoming',
    'In Stores': 'badge-in-stores',
    'Out of Production': 'bg-slate-700/20 text-slate-400 border border-slate-700',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header with back link */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-100">{car.name}</h1>
      </div>

      {/* Image */}
      <div className="relative rounded-xl overflow-hidden shadow-xl border border-slate-700 aspect-video w-full max-w-md mx-auto md:mx-0">
        <ImageFallback
          diecast={car.images.diecast}
          realCar={car.images.realCar}
          alt={car.name}
          className="hw-card-image"
          showDisclaimer={Boolean(car.images.realCar) && !car.images.diecast}
        />

        {car.superTreasureHunt && (
          <div className="hw-badge badge-sth absolute top-4 left-4">
            <ShieldAlert className="h-4 w-4" /> SUPER TREASURE HUNT
          </div>
        )}
        {car.treasureHunt && !car.superTreasureHunt && (
          <div className="hw-badge badge-th absolute top-4 left-4">
            <Flame className="h-4 w-4" /> TREASURE HUNT
          </div>
        )}
      </div>

      {car.images.realCar && !car.images.diecast && (
        <div className="bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-lg p-3 mt-2 text-sm">
          ⚠️ This is a real-car reference image, not the actual Hot Wheels diecast. The physical Hot Wheels version may look different.
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Origin</p>
                  <p className="text-slate-200">{car.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Country</p>
                  <p className="text-slate-200">{car.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Year Introduced</p>
                  <p className="text-slate-200">{car.yearIntroduced}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Release Date</p>
                  <p className="text-slate-200">{releaseDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Availability</h2>
            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${availabilityConfig[car.availability] || 'bg-slate-700/20 text-slate-400 border border-slate-700'}`}>
              {car.availability}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Series & Case</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Layout className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Series</p>
                  <p className="text-slate-200">{car.series}</p>
                </div>
              </div>
              {car.caseLetter && (
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Case</p>
                    <p className="text-slate-200">{car.caseLetter}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {car.treasureHunt || car.superTreasureHunt ? (
            <div className="pt-4 border-t border-slate-700 bg-amber-500/5 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400" /> Treasure Hunt Status
              </h2>
              <div className="space-y-2">
                {car.superTreasureHunt && (
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-slate-300">Super Treasure Hunt (STH)</span>
                  </div>
                )}
                {car.treasureHunt && !car.superTreasureHunt && (
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-slate-300">Treasure Hunt (TH)</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="pt-4 border-t border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">Sources</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-500" />
                <span className="text-slate-400">Release info:</span>
                <span className="text-orange-400">{car.sources.release}</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-500" />
                <span className="text-slate-400">Details:</span>
                <span className="text-orange-400">{car.sources.details}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Last updated:</span>
                <span className="text-slate-500">{car.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
