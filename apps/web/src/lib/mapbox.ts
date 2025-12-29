const MAPBOX_TOKEN = import.meta.env.MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.warn('Mapbox token not found. Please set MAPBOX_TOKEN in your .env file.');
}

export const mapboxToken = MAPBOX_TOKEN;

export interface DirectionsResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
    legs: {
      distance: number;
      duration: number;
      steps: {
        maneuver: {
          instruction: string;
          type: string;
        };
        distance: number;
        duration: number;
      }[];
    }[];
  }[];
}

export async function getDirections(
  waypoints: { lat: number; lng: number }[],
  profile: 'cycling' | 'walking' | 'driving' = 'cycling'
): Promise<DirectionsResponse | null> {
  if (waypoints.length < 2) return null;

  const coordinates = waypoints.map((p) => `${p.lng},${p.lat}`).join(';');
  // Request elevation data with the route
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&overview=full&steps=true&annotations=distance&access_token=${MAPBOX_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Directions API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get directions:', error);
    return null;
  }
}

export interface ElevationPoint {
  lat: number;
  lng: number;
  elevation: number;
}

export async function getElevation(
  _coordinates: [number, number][]
): Promise<ElevationPoint[]> {
  // Mapbox Tilequery API for elevation
  // For MVP, we'll use a simpler approach or skip elevation
  // In production, you'd use Mapbox Terrain-RGB tiles

  // For now, return empty array - elevation can be added later
  // TODO: Implement elevation lookup using Mapbox Terrain-RGB tiles
  return [];
}

export function calculateElevationGain(elevations: number[]): number {
  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) {
      gain += diff;
    }
  }
  return Math.round(gain);
}

// Default map center (London)
export const DEFAULT_CENTER: [number, number] = [-0.1276, 51.5074];
export const DEFAULT_ZOOM = 12;

// Map styles
export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
} as const;

// Geocoding types
export interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  place_type: string[];
  text: string;
  context?: { id: string; text: string }[];
}

export interface GeocodingResponse {
  features: GeocodingFeature[];
}

export async function geocodeSearch(query: string): Promise<GeocodingFeature[]> {
  if (!query.trim()) return [];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&types=country,region,postcode,district,place,locality,neighborhood,address&limit=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }
    const data: GeocodingResponse = await response.json();
    return data.features;
  } catch (error) {
    console.error('Failed to geocode:', error);
    return [];
  }
}

// Fetch elevation data from Open-Meteo (free, no API key required)
// Uses batched requests with retry logic and rate limit handling
export async function getElevationData(
  coordinates: [number, number][]
): Promise<number[]> {
  if (coordinates.length === 0) return [];

  // Sample points for accuracy (up to 200 points to reduce API calls)
  const maxTotalPoints = 200;
  const pointsPerBatch = 100; // API limit per request

  const step = Math.max(1, Math.floor(coordinates.length / maxTotalPoints));
  let sampledCoords = coordinates.filter((_, i) => i % step === 0);

  // Ensure we include the last point
  if (sampledCoords.length > 0 &&
      sampledCoords[sampledCoords.length - 1] !== coordinates[coordinates.length - 1]) {
    sampledCoords.push(coordinates[coordinates.length - 1]);
  }

  // Split into batches
  const batches: [number, number][][] = [];
  for (let i = 0; i < sampledCoords.length; i += pointsPerBatch) {
    batches.push(sampledCoords.slice(i, i + pointsPerBatch));
  }

  // Fetch a single batch with retry logic
  async function fetchBatchWithRetry(
    batch: [number, number][],
    retries = 3,
    delay = 1000
  ): Promise<number[]> {
    const lats = batch.map(c => c[1].toFixed(6)).join(',');
    const lngs = batch.map(c => c[0].toFixed(6)).join(',');
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url);

        if (response.status === 429) {
          // Rate limited - wait with exponential backoff
          const backoffDelay = delay * Math.pow(2, attempt);
          console.warn(`Rate limited, retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          continue;
        }

        if (!response.ok) {
          console.warn('Open-Meteo elevation API error:', response.status);
          return [];
        }

        const data = await response.json();
        return data.elevation || [];
      } catch (error) {
        if (attempt === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return [];
  }

  try {
    // Fetch batches sequentially with small delay to avoid rate limits
    const elevations: number[] = [];
    for (let i = 0; i < batches.length; i++) {
      const batchElevations = await fetchBatchWithRetry(batches[i]);
      elevations.push(...batchElevations);

      // Small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    if (elevations.length === 0) {
      console.warn('Open-Meteo returned no elevation data');
    }

    return elevations;
  } catch (error) {
    console.error('Failed to fetch elevation:', error);
    return [];
  }
}

// Get user's current location
export function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}
