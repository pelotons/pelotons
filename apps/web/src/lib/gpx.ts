import { Waypoint } from '@peloton/shared';

export function generateGPX(
  waypoints: Waypoint[],
  routeCoordinates: [number, number][],
  name: string = 'Route',
  description: string = ''
): string {
  const now = new Date().toISOString();

  const trackpoints = routeCoordinates
    .map(([lng, lat]) => `      <trkpt lat="${lat}" lon="${lng}"></trkpt>`)
    .join('\n');

  const waypointElements = waypoints
    .map(
      (wp, i) => `
    <wpt lat="${wp.lat}" lon="${wp.lng}">
      <name>${escapeXml(wp.name || `Waypoint ${i + 1}`)}</name>
      <type>${wp.type || 'via'}</type>
    </wpt>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Peloton"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <desc>${escapeXml(description)}</desc>
    <time>${now}</time>
  </metadata>
  ${waypointElements}
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trackpoints}
    </trkseg>
  </trk>
</gpx>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function calculateTotalDistance(coordinates: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    total += haversineDistance(
      coordinates[i - 1][1],
      coordinates[i - 1][0],
      coordinates[i][1],
      coordinates[i][0]
    );
  }
  return Math.round(total);
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function downloadGPX(gpxContent: string, filename: string): void {
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.gpx') ? filename : `${filename}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export interface ParsedGPX {
  name: string;
  description: string;
  waypoints: Waypoint[];
  trackPoints: [number, number][]; // [lng, lat]
  distance: number;
}

export function parseGPX(gpxContent: string): ParsedGPX | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxContent, 'application/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('GPX parse error:', parseError.textContent);
      return null;
    }

    // Get metadata
    const name = doc.querySelector('metadata > name')?.textContent ||
                 doc.querySelector('trk > name')?.textContent ||
                 'Imported Route';
    const description = doc.querySelector('metadata > desc')?.textContent ||
                        doc.querySelector('trk > desc')?.textContent ||
                        '';

    // Parse waypoints (wpt elements)
    const wptElements = doc.querySelectorAll('wpt');
    const waypoints: Waypoint[] = Array.from(wptElements).map((wpt, index) => {
      const lat = parseFloat(wpt.getAttribute('lat') || '0');
      const lng = parseFloat(wpt.getAttribute('lon') || '0');
      const wptName = wpt.querySelector('name')?.textContent || undefined;
      const wptType = wpt.querySelector('type')?.textContent as 'start' | 'via' | 'end' | undefined;

      return {
        lat,
        lng,
        name: wptName,
        type: wptType || (index === 0 ? 'start' : 'via'),
      };
    });

    // Parse track points (trkpt elements)
    const trkptElements = doc.querySelectorAll('trkpt');
    const trackPoints: [number, number][] = Array.from(trkptElements).map((trkpt) => {
      const lat = parseFloat(trkpt.getAttribute('lat') || '0');
      const lng = parseFloat(trkpt.getAttribute('lon') || '0');
      return [lng, lat]; // Mapbox uses [lng, lat]
    });

    // If no explicit waypoints, create start/end from track
    if (waypoints.length === 0 && trackPoints.length >= 2) {
      waypoints.push({
        lat: trackPoints[0][1],
        lng: trackPoints[0][0],
        type: 'start',
      });
      waypoints.push({
        lat: trackPoints[trackPoints.length - 1][1],
        lng: trackPoints[trackPoints.length - 1][0],
        type: 'end',
      });
    }

    // Update last waypoint type to 'end'
    if (waypoints.length > 1) {
      waypoints[waypoints.length - 1].type = 'end';
    }

    // Calculate distance
    const distance = calculateTotalDistance(trackPoints);

    return {
      name,
      description,
      waypoints,
      trackPoints,
      distance,
    };
  } catch (error) {
    console.error('Failed to parse GPX:', error);
    return null;
  }
}

export function readGPXFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
