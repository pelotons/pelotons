import { useState, useRef } from 'react';

interface ElevationProfileProps {
  elevations: number[];
  distance: number;
  coordinates?: [number, number][];
  loading?: boolean;
  /** Position along route (0-1) from external source (e.g., map hover) */
  highlightPosition?: number | null;
  /** Called when hovering on profile with position (0-1) and coordinates */
  onHover?: (position: number | null, coords: [number, number] | null) => void;
}

export function ElevationProfile({
  elevations,
  distance,
  coordinates,
  loading,
  highlightPosition,
  onHover,
}: ElevationProfileProps) {
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    elevation: number;
    distance: number;
    gradient: number | null;
    coords: [number, number] | null;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading elevation data...
        </div>
      </div>
    );
  }

  // If no elevation data, show placeholder
  if (elevations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Elevation data not available
        </div>
      </div>
    );
  }

  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const range = maxEle - minEle || 1;
  const elevationGain = elevations.reduce((acc, ele, i) => {
    if (i === 0) return 0;
    const diff = ele - elevations[i - 1];
    return diff > 0 ? acc + diff : acc;
  }, 0);

  // Create SVG path for elevation profile
  const points = elevations.map((ele, i) => {
    const x = (i / (elevations.length - 1)) * 100;
    const y = 100 - ((ele - minEle) / range) * 80 - 10; // Leave padding
    return { x, y, ele };
  });

  const pathData = `M0,100 L${points.map(p => `${p.x},${p.y}`).join(' L')} L100,100 Z`;
  const lineData = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;

  // Calculate gradient between two points (as percentage)
  const calculateGradient = (index: number): number | null => {
    if (index <= 0 || index >= elevations.length || !coordinates || coordinates.length < 2) {
      return null;
    }

    // Get elevation change
    const elevDiff = elevations[index] - elevations[index - 1];

    // Get horizontal distance (approximate using coordinates)
    const segmentDistance = distance / (elevations.length - 1);

    if (segmentDistance === 0) return null;

    // Gradient as percentage (rise/run * 100)
    return (elevDiff / segmentDistance) * 100;
  };

  // Get interpolated coordinate for a position
  const getCoordinateAtPosition = (position: number): [number, number] | null => {
    if (!coordinates || coordinates.length < 2) return null;

    const index = position * (coordinates.length - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.min(lowerIndex + 1, coordinates.length - 1);
    const fraction = index - lowerIndex;

    const lng = coordinates[lowerIndex][0] + (coordinates[upperIndex][0] - coordinates[lowerIndex][0]) * fraction;
    const lat = coordinates[lowerIndex][1] + (coordinates[upperIndex][1] - coordinates[lowerIndex][1]) * fraction;

    return [lng, lat];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const index = Math.min(Math.floor(position * elevations.length), elevations.length - 1);

    if (index >= 0 && index < elevations.length) {
      const coords = getCoordinateAtPosition(position);
      const gradient = calculateGradient(index);

      setHoverInfo({
        x: position * 100,
        elevation: elevations[index],
        distance: position * distance,
        gradient,
        coords,
      });

      // Notify parent of hover position
      if (onHover) {
        onHover(position, coords);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
    if (onHover) {
      onHover(null, null);
    }
  };

  // Handle external highlight position (from map hover)
  const externalHighlight = highlightPosition !== null && highlightPosition !== undefined
    ? {
        x: highlightPosition * 100,
        elevation: elevations[Math.floor(highlightPosition * (elevations.length - 1))] || 0,
        distance: highlightPosition * distance,
      }
    : null;

  return (
    <div className="h-full flex flex-col px-2 py-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between text-xs flex-shrink-0">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            <span className="font-medium text-gray-700">{Math.round(minEle)}</span> - <span className="font-medium text-gray-700">{Math.round(maxEle)}</span> m
          </span>
          <span>
            <span className="text-green-600 font-medium">+{Math.round(elevationGain)}m</span> gain
          </span>
        </div>
        {hoverInfo && (
          <div className="text-xs flex items-center gap-2">
            <span className="text-gray-500">{(hoverInfo.distance / 1000).toFixed(2)} km</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{Math.round(hoverInfo.elevation)}m</span>
            {hoverInfo.gradient !== null && (
              <>
                <span className="text-gray-300">|</span>
                <span className={`font-medium ${hoverInfo.gradient > 0 ? 'text-red-500' : hoverInfo.gradient < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                  {hoverInfo.gradient > 0 ? '+' : ''}{hoverInfo.gradient.toFixed(1)}%
                </span>
              </>
            )}
          </div>
        )}
        {externalHighlight && !hoverInfo && (
          <div className="text-xs flex items-center gap-2">
            <span className="text-gray-500">{(externalHighlight.distance / 1000).toFixed(2)} km</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{Math.round(externalHighlight.elevation)}m</span>
          </div>
        )}
      </div>

      {/* Graph with Y-axis */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Y-axis labels */}
        <div className="w-8 flex flex-col justify-between py-0 text-[9px] text-gray-400 text-right pr-1 flex-shrink-0">
          <span>{Math.round(maxEle)}</span>
          <span>{Math.round(minEle)}</span>
        </div>

        {/* Graph area */}
        <div
          ref={containerRef}
          className="flex-1 relative bg-gray-50 rounded-r cursor-crosshair border-l border-b border-gray-200"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />

            {/* Vertical grid lines */}
            <line x1="25" y1="0" x2="25" y2="100" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
            <line x1="75" y1="0" x2="75" y2="100" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />

            {/* Filled area with gradient */}
            <defs>
              <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path d={pathData} fill="url(#elevationGradient)" />

            {/* Line */}
            <path
              d={lineData}
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Baseline */}
            <line x1="0" y1="100" x2="100" y2="100" stroke="#6b7280" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Hover indicator (internal) */}
          {hoverInfo && (
            <div
              className="absolute top-0 bottom-0 w-px bg-gray-600 pointer-events-none"
              style={{ left: `${hoverInfo.x}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-700 rounded-full border-2 border-white shadow" />
            </div>
          )}

          {/* Floating tooltip */}
          {hoverInfo && (
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: `${hoverInfo.x}%`,
                top: '10%',
                transform: hoverInfo.x > 70 ? 'translateX(-100%)' : 'translateX(8px)',
              }}
            >
              <div className="bg-white border border-gray-300 shadow-lg px-3 py-2 text-sm whitespace-nowrap">
                <div className="flex gap-2">
                  <span className="text-gray-500">Distance</span>
                  <span className="font-semibold">{(hoverInfo.distance / 1000).toFixed(2)} km</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Elevation</span>
                  <span className="font-semibold">{Math.round(hoverInfo.elevation)} m</span>
                </div>
                {hoverInfo.gradient !== null && (
                  <div className="flex gap-2">
                    <span className="text-gray-500">Grade</span>
                    <span className="font-semibold">{hoverInfo.gradient > 0 ? '+' : ''}{hoverInfo.gradient.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* External highlight indicator (from map hover) */}
          {externalHighlight && !hoverInfo && (
            <div
              className="absolute top-0 bottom-0 w-px bg-orange-500 pointer-events-none"
              style={{ left: `${externalHighlight.x}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow" />
            </div>
          )}

          {/* Distance markers */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[8px] text-gray-400">
            <span>0</span>
            <span>{(distance / 2000).toFixed(1)}</span>
            <span>{(distance / 1000).toFixed(1)}km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
