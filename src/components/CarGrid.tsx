import type { Car } from '../types/car';
import { CarCard } from './CarCard';

interface CarGridProps {
  cars: Car[];
}

export function CarGrid({ cars }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="hw-empty">
        <p>No cars found.</p>
      </div>
    );
  }

  return (
    <div className="hw-car-grid">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
