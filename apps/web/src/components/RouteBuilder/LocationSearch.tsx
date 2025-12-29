import { useState, useEffect, useRef } from 'react';
import { geocodeSearch, GeocodingFeature } from '@/lib/mapbox';

interface LocationSearchProps {
  onLocationSelect: (lng: number, lat: number, zoom?: number) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const features = await geocodeSearch(query);
      setResults(features);
      setIsOpen(features.length > 0);
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (feature: GeocodingFeature) => {
    const [lng, lat] = feature.center;

    // Determine zoom level based on place type
    let zoom = 14;
    if (feature.place_type.includes('country')) zoom = 5;
    else if (feature.place_type.includes('region')) zoom = 8;
    else if (feature.place_type.includes('postcode')) zoom = 14;
    else if (feature.place_type.includes('place')) zoom = 12;
    else if (feature.place_type.includes('address')) zoom = 16;

    onLocationSelect(lng, lat, zoom);
    setQuery(feature.text);
    setIsOpen(false);
  };

  const getPlaceTypeLabel = (types: string[]): string => {
    if (types.includes('address')) return 'Address';
    if (types.includes('postcode')) return 'Postcode';
    if (types.includes('place')) return 'City';
    if (types.includes('region')) return 'Region';
    if (types.includes('country')) return 'Country';
    if (types.includes('neighborhood')) return 'Neighborhood';
    if (types.includes('locality')) return 'Locality';
    return '';
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="w-64 px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
        {isLoading ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {results.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleSelect(feature)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {feature.text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {feature.place_name}
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {getPlaceTypeLabel(feature.place_type)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
