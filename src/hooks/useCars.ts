import { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types/car';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCars = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/data/cars.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load cars');
        return res.json();
      })
      .then((data: Car[]) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load cars:', err);
        setError(err as Error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, refetch: fetchCars };
}
