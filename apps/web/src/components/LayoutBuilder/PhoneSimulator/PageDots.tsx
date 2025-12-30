interface PageDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function PageDots({ total, current, onDotClick }: PageDotsProps) {
  if (total <= 1) return null;

  return (
    <div className="flex justify-center gap-2 py-3">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`
            w-2 h-2 rounded-full transition-all duration-200
            ${index === current
              ? 'bg-blue-600 scale-125'
              : 'bg-gray-400 hover:bg-gray-500'
            }
          `}
          aria-label={`Go to screen ${index + 1}`}
        />
      ))}
    </div>
  );
}
