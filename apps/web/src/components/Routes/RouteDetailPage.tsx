import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, DbRoute } from '@/lib/supabase';
import { Route, Waypoint } from '@peloton/shared';
import { MapView, MapViewHandle } from '../RouteBuilder/MapView';
import { ElevationProfile } from '../RouteBuilder/ElevationProfile';
import { getElevationData } from '@/lib/mapbox';
import { downloadGPX } from '@/lib/gpx';
import { AddToCollectionDialog } from '../Collections/AddToCollectionDialog';

function dbToRoute(db: DbRoute): Route {
  return {
    id: db.id,
    userId: db.user_id,
    name: db.name,
    description: db.description ?? undefined,
    distanceM: db.distance_m,
    elevationGainM: db.elevation_gain_m ?? undefined,
    gpxData: db.gpx_data,
    waypoints: db.waypoints as Waypoint[],
    routeCoordinates: db.route_coordinates as [number, number][] | undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<MapViewHandle>(null);

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [elevation, setElevation] = useState<number[]>([]);
  const [loadingElevation, setLoadingElevation] = useState(false);
  const [highlightCoordinate, setHighlightCoordinate] = useState<[number, number] | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);
  const [showAddToCollection, setShowAddToCollection] = useState(false);

  useEffect(() => {
    async function fetchRoute() {
      if (!id) {
        setError('No route ID provided');
        setLoading(false);
        return;
      }

      // Reset state when route ID changes
      setLoading(true);
      setError(null);
      setRoute(null);
      setRouteGeometry(null);
      setElevation([]);

      const { data, error: fetchError } = await supabase
        .from('routes')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setRoute(null);
      } else if (data) {
        const routeData = dbToRoute(data as DbRoute);
        setRoute(routeData);

        // Use routeCoordinates if available, otherwise parse from GPX
        let coords: [number, number][] = [];

        if (routeData.routeCoordinates && routeData.routeCoordinates.length > 0) {
          coords = routeData.routeCoordinates;
        } else if (routeData.gpxData) {
          // Fallback: parse GPX to get route geometry
          const parser = new DOMParser();
          const doc = parser.parseFromString(routeData.gpxData, 'application/xml');
          const trkpts = doc.querySelectorAll('trkpt');
          coords = Array.from(trkpts).map((pt) => {
            const lat = parseFloat(pt.getAttribute('lat') || '0');
            const lng = parseFloat(pt.getAttribute('lon') || '0');
            return [lng, lat];
          });
        }

        if (coords.length > 0) {
          setRouteGeometry(coords);

          // Fetch elevation
          setLoadingElevation(true);
          try {
            const elevationData = await getElevationData(coords);
            setElevation(elevationData);
          } catch (e) {
            console.error('Failed to fetch elevation:', e);
          } finally {
            setLoadingElevation(false);
          }
        }
      }

      setLoading(false);
    }

    fetchRoute();
  }, [id]);

  const handleDelete = async () => {
    if (!route) return;

    if (window.confirm(`Are you sure you want to delete "${route.name}"?`)) {
      const { error: deleteError } = await supabase
        .from('routes')
        .delete()
        .eq('id', route.id);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        navigate('/routes');
      }
    }
  };

  const handleExportGPX = () => {
    if (!route?.gpxData) return;
    downloadGPX(route.gpxData, route.name);
  };

  const handleElevationHover = (_position: number | null, coords: [number, number] | null) => {
    setHighlightCoordinate(coords);
  };

  const handleRouteHover = (position: number | null) => {
    setHighlightPosition(position);
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Route not found</h2>
        <p className="text-gray-500 mb-6">{error || 'The route you are looking for does not exist.'}</p>
        <Link
          to="/routes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to routes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/routes"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{route.name}</h1>
              {route.description && (
                <p className="text-sm text-gray-500">{route.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddToCollection(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Add to Collection
            </button>
            <button
              onClick={handleExportGPX}
              className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export GPX
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium">{formatDistance(route.distanceM)}</span>
          </div>

          {route.elevationGainM && route.elevationGainM > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-gray-600">Elevation:</span>
              <span className="font-medium">{route.elevationGainM}m</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-600">Waypoints:</span>
            <span className="font-medium">{route.waypoints.length}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(route.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          key={route.id}
          ref={mapRef}
          waypoints={route.waypoints}
          routeGeometry={routeGeometry}
          onMapClick={() => {}}
          highlightCoordinate={highlightCoordinate}
          onRouteHover={handleRouteHover}
          requestGeolocation={false}
        />
      </div>

      {/* Elevation Profile */}
      {routeGeometry && routeGeometry.length > 0 && (
        <div className="h-28 min-h-28 max-h-28 flex-shrink-0 bg-white border-t">
          <ElevationProfile
            elevations={elevation}
            distance={route.distanceM}
            coordinates={routeGeometry}
            loading={loadingElevation}
            highlightPosition={highlightPosition}
            onHover={handleElevationHover}
          />
        </div>
      )}

      {/* Add to Collection Dialog */}
      {showAddToCollection && (
        <AddToCollectionDialog
          routeId={route.id}
          routeName={route.name}
          onClose={() => setShowAddToCollection(false)}
        />
      )}
    </div>
  );
}
