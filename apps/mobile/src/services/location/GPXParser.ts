export interface ParsedRoute {
  name: string;
  trackpoints: { lat: number; lng: number; ele?: number }[];
  waypoints: { lat: number; lng: number; name?: string; type?: string }[];
}

export function parseGPX(gpxString: string): ParsedRoute {
  // Extract route name
  const nameMatch = gpxString.match(/<name>([^<]+)<\/name>/);
  const name = nameMatch ? nameMatch[1] : 'Unnamed Route';

  // Extract track points
  const trackpoints: ParsedRoute['trackpoints'] = [];
  const trkptRegex = /<trkpt lat="([^"]+)" lon="([^"]+)"[^>]*>([^]*?)<\/trkpt>/g;
  let match;

  while ((match = trkptRegex.exec(gpxString)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const eleMatch = match[3].match(/<ele>([^<]+)<\/ele>/);

    trackpoints.push({
      lat,
      lng,
      ele: eleMatch ? parseFloat(eleMatch[1]) : undefined,
    });
  }

  // Also try simpler format without content
  if (trackpoints.length === 0) {
    const simpleTrkptRegex = /<trkpt lat="([^"]+)" lon="([^"]+)"[^>]*\/?>/g;
    while ((match = simpleTrkptRegex.exec(gpxString)) !== null) {
      trackpoints.push({
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      });
    }
  }

  // Extract waypoints
  const waypoints: ParsedRoute['waypoints'] = [];
  const wptRegex = /<wpt lat="([^"]+)" lon="([^"]+)"[^>]*>([^]*?)<\/wpt>/g;

  while ((match = wptRegex.exec(gpxString)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const nameMatch = match[3].match(/<name>([^<]+)<\/name>/);
    const typeMatch = match[3].match(/<type>([^<]+)<\/type>/);

    waypoints.push({
      lat,
      lng,
      name: nameMatch ? nameMatch[1] : undefined,
      type: typeMatch ? typeMatch[1] : undefined,
    });
  }

  return { name, trackpoints, waypoints };
}

export function generateGPX(
  dataPoints: { latitude: number; longitude: number; altitude?: number; timestamp: number }[],
  name: string = 'Ride'
): string {
  const now = new Date().toISOString();

  const trackpoints = dataPoints
    .map((point) => {
      const time = new Date(point.timestamp).toISOString();
      const ele = point.altitude ? `\n        <ele>${point.altitude.toFixed(1)}</ele>` : '';
      return `      <trkpt lat="${point.latitude.toFixed(6)}" lon="${point.longitude.toFixed(6)}">
        <time>${time}</time>${ele}
      </trkpt>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Peloton"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <time>${now}</time>
  </metadata>
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

export function calculateRouteStats(
  trackpoints: { lat: number; lng: number; ele?: number }[]
): {
  distanceM: number;
  elevationGainM: number;
} {
  let distanceM = 0;
  let elevationGainM = 0;

  for (let i = 1; i < trackpoints.length; i++) {
    const prev = trackpoints[i - 1];
    const curr = trackpoints[i];

    // Calculate distance using Haversine
    const R = 6371000;
    const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
    const dLon = ((curr.lng - prev.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((prev.lat * Math.PI) / 180) *
        Math.cos((curr.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distanceM += R * c;

    // Calculate elevation gain
    if (curr.ele !== undefined && prev.ele !== undefined) {
      const elevDiff = curr.ele - prev.ele;
      if (elevDiff > 0) {
        elevationGainM += elevDiff;
      }
    }
  }

  return {
    distanceM: Math.round(distanceM),
    elevationGainM: Math.round(elevationGainM),
  };
}
