export interface CarImage {
  diecast: string | null;
  realCar: string | null;
  fallbackUsed: boolean;
}

export interface CarSource {
  release: string;
  details: string;
}

export interface Car {
  id: string;
  name: string;
  castingName: string;
  origin: string;
  country: string;
  series: string;
  yearIntroduced: number;
  treasureHunt: boolean;
  superTreasureHunt: boolean;
  caseLetter: string | null;
  releaseDate: string | null;
  availability: string;
  images: CarImage;
  sources: CarSource;
  lastUpdated: string;
  type: string;
}
