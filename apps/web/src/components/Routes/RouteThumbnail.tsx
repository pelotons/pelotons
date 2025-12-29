import { useMemo, useState } from 'react';
import { Waypoint } from '@peloton/shared';
import { mapboxToken } from '@/lib/mapbox';

interface RouteThumbnailProps {
  waypoints: Waypoint[];
  routeCoordinates?: [number, number][]; // Full route geometry [lng, lat] pairs
  width?: number;
  height?: number;
}

// Simplify coordinates to reduce URL length while preserving route shape
// Uses Douglas-Peucker-like approach with fixed sampling
function simplifyCoordinates(coords: [number, number][], maxPoints: number = 100): [number, number][] {
  if (coords.length <= maxPoints) return coords;

  const step = (coords.length - 1) / (maxPoints - 1);
  const simplified: [number, number][] = [];

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.min(Math.round(i * step), coords.length - 1);
    simplified.push(coords[index]);
  }

  return simplified;
}

// Encode coordinates for Mapbox Static API using polyline5 format
// This is much more compact than raw coordinates
function encodePolyline5(coordinates: [number, number][]): string {
  let encoded = '';
  let prevLat = 0;
  let prevLng = 0;

  for (const [lng, lat] of coordinates) {
    // Mapbox polyline uses lat, lng order and 1e5 precision
    const latInt = Math.round(lat * 1e5);
    const lngInt = Math.round(lng * 1e5);

    encoded += encodeSignedNumber(latInt - prevLat);
    encoded += encodeSignedNumber(lngInt - prevLng);

    prevLat = latInt;
    prevLng = lngInt;
  }

  return encoded;
}

function encodeSignedNumber(num: number): string {
  let sgn = num << 1;
  if (num < 0) sgn = ~sgn;
  return encodeUnsignedNumber(sgn);
}

function encodeUnsignedNumber(num: number): string {
  let encoded = '';
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  encoded += String.fromCharCode(num + 63);
  return encoded;
}

export function RouteThumbnail({ waypoints, routeCoordinates, width = 400, height = 300 }: RouteThumbnailProps) {
  const imageUrl = useMemo(() => {
    if (!mapboxToken || waypoints.length < 2) {
      return null;
    }

    // Use full route geometry if available, otherwise fall back to waypoints
    let pathString: string;

    if (routeCoordinates && routeCoordinates.length >= 2) {
      // Simplify to avoid URL length limits (~8000 char limit)
      const simplified = simplifyCoordinates(routeCoordinates, 150);
      const encoded = encodePolyline5(simplified);
      pathString = `path-4+0066cc-0.8(${encodeURIComponent(encoded)})`;
    } else {
      // Fall back to waypoints (straight lines between points)
      const pathCoords = waypoints
        .map((wp) => `${wp.lng.toFixed(5)},${wp.lat.toFixed(5)}`)
        .join(',');
      pathString = `path-4+0066cc-0.8(${encodeURIComponent(pathCoords)})`;
    }

    const url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${pathString}/auto/${width}x${height}@2x?padding=30&access_token=${mapboxToken}`;

    return url;
  }, [waypoints, routeCoordinates, width, height]);

  const [imageError, setImageError] = useState(false);

  const fallback = (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    </div>
  );

  if (!imageUrl || waypoints.length < 2 || imageError) {
    return fallback;
  }

  return (
    <img
      src={imageUrl}
      alt="Route preview"
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setImageError(true)}
    />
  );
}
