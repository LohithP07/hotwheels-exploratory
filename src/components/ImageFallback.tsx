interface ImageFallbackProps {
  diecast: string | null;
  realCar: string | null;
  alt: string;
  className?: string;
  showDisclaimer?: boolean;
}

export function ImageFallback({
  diecast,
  realCar,
  alt,
  className = 'hw-card-image',
  showDisclaimer = false,
}: ImageFallbackProps) {
  const placeholderSrc = `https://placehold.co/400x225/0f172a/ffffff?text=${encodeURIComponent(alt)}`;

  const initialSrc = diecast || realCar || placeholderSrc;
  const isRealCar = Boolean(realCar) && !diecast;
  const isPlaceholder = !diecast && !realCar;

  return (
    <div className={className}>
      <img
        src={initialSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;

          if (diecast && target.src === diecast && realCar) {
            target.src = realCar;
          } else if ((realCar && target.src === realCar) || target.src === placeholderSrc) {
            target.src = placeholderSrc;
          }
        }}
      />

      {isRealCar && (
        <div className="hw-card-image-tag tag-real-car">Real-car image</div>
      )}

      {isPlaceholder && (
        <div className="hw-card-image-tag tag-diecast">No image</div>
      )}

      {showDisclaimer && (
        <div className="hw-card-image-tag tag-diecast absolute bottom-[0.75rem] right-[0.75rem]">
          Not actual HW diecast
        </div>
      )}
    </div>
  );
}
