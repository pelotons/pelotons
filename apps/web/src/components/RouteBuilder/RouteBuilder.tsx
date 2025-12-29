import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapView, MapViewHandle } from './MapView';
import { RouteControls } from './RouteControls';
import { ElevationProfile } from './ElevationProfile';
import { LocationSearch } from './LocationSearch';
import { WaypointContextMenu } from './WaypointContextMenu';
import { useRoutes } from '@/hooks/useRoutes';
import { getDirections, getElevationData } from '@/lib/mapbox';
import { generateGPX, downloadGPX, parseGPX, readGPXFile } from '@/lib/gpx';
import { Waypoint } from '@peloton/shared';

type RouteProfile = 'cycling' | 'walking' | 'driving';

export function RouteBuilder() {
  const { routes, createRoute, loading: routesLoading } = useRoutes();
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [elevation, setElevation] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedRouteId, setSavedRouteId] = useState<string | null>(null);
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [routeProfile, setRouteProfile] = useState<RouteProfile>('cycling');
  const [useCyclePaths, setUseCyclePaths] = useState(true);
  const mapRef = useRef<MapViewHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadingElevation, setLoadingElevation] = useState(false);

  // Hover sync between map and elevation profile
  const [highlightCoordinate, setHighlightCoordinate] = useState<[number, number] | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    waypointIndex: number;
  } | null>(null);

  // Segment distances between waypoints
  const [segmentDistances, setSegmentDistances] = useState<number[]>([]);

  const calculateRoute = useCallback(async (points: Waypoint[], profile: RouteProfile = routeProfile) => {
    if (points.length < 2) {
      setRouteGeometry(null);
      setDistance(0);
      setElevation([]);
      setSegmentDistances([]);
      return;
    }

    const response = await getDirections(points, profile);
    if (response?.routes?.[0]) {
      const route = response.routes[0];
      const coords = route.geometry.coordinates;
      setRouteGeometry(coords);
      setDistance(route.distance);

      // Extract segment distances from legs (distance between each waypoint)
      if (route.legs) {
        const distances = route.legs.map(leg => leg.distance);
        setSegmentDistances(distances);
      }

      // Fetch elevation data from Open-Meteo (free API)
      setLoadingElevation(true);
      try {
        const elevationData = await getElevationData(coords);
        if (elevationData.length > 0) {
          setElevation(elevationData);
        } else {
          setElevation([]);
        }
      } catch (error) {
        console.error('Failed to fetch elevation:', error);
        setElevation([]);
      } finally {
        setLoadingElevation(false);
      }
    }
  }, [routeProfile]);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      const newWaypoint: Waypoint = {
        lat,
        lng,
        type: waypoints.length === 0 ? 'start' : 'via',
      };

      const updatedWaypoints = [...waypoints, newWaypoint];

      // Mark the last waypoint as 'end' if we have more than one
      if (updatedWaypoints.length > 1) {
        updatedWaypoints[updatedWaypoints.length - 2].type = 'via';
        updatedWaypoints[updatedWaypoints.length - 1].type = 'end';
      }

      setWaypoints(updatedWaypoints);
      await calculateRoute(updatedWaypoints);
    },
    [waypoints, calculateRoute]
  );

  const handleWaypointDrag = useCallback(
    async (index: number, lat: number, lng: number) => {
      const updatedWaypoints = [...waypoints];
      updatedWaypoints[index] = { ...updatedWaypoints[index], lat, lng };
      setWaypoints(updatedWaypoints);
      await calculateRoute(updatedWaypoints);
    },
    [waypoints, calculateRoute]
  );

  const handleWaypointRemove = useCallback(
    async (index: number) => {
      const updatedWaypoints = waypoints.filter((_, i) => i !== index);

      // Update types
      if (updatedWaypoints.length > 0) {
        updatedWaypoints[0].type = 'start';
        if (updatedWaypoints.length > 1) {
          updatedWaypoints[updatedWaypoints.length - 1].type = 'end';
        }
      }

      setWaypoints(updatedWaypoints);
      await calculateRoute(updatedWaypoints);
    },
    [waypoints, calculateRoute]
  );

  // Track the drag state - which waypoint index is being dragged
  const [dragInsertIndex, setDragInsertIndex] = useState<number | null>(null);
  const lastRouteCalcTime = useRef(0);
  const pendingCalcTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestDragWaypoints = useRef<Waypoint[] | null>(null);

  const handleRouteDrag = useCallback(
    (insertAfterIndex: number, lat: number, lng: number) => {
      let updatedWaypoints: Waypoint[];

      if (dragInsertIndex === null) {
        // First drag event - insert new waypoint
        const newWaypoint: Waypoint = { lat, lng, type: 'via' };
        updatedWaypoints = [...waypoints];
        updatedWaypoints.splice(insertAfterIndex + 1, 0, newWaypoint);
        setDragInsertIndex(insertAfterIndex + 1);
      } else {
        // Subsequent drag events - update existing waypoint position
        updatedWaypoints = [...waypoints];
        updatedWaypoints[dragInsertIndex] = { ...updatedWaypoints[dragInsertIndex], lat, lng };
      }

      // Update types
      updatedWaypoints[0].type = 'start';
      updatedWaypoints[updatedWaypoints.length - 1].type = 'end';
      for (let i = 1; i < updatedWaypoints.length - 1; i++) {
        updatedWaypoints[i].type = 'via';
      }

      setWaypoints(updatedWaypoints);
      latestDragWaypoints.current = updatedWaypoints;

      // Throttle route calculations to max once per 150ms
      const now = Date.now();
      if (now - lastRouteCalcTime.current > 150) {
        lastRouteCalcTime.current = now;
        calculateRoute(updatedWaypoints);
      } else {
        // Schedule a calculation for the latest position
        if (pendingCalcTimeout.current) {
          clearTimeout(pendingCalcTimeout.current);
        }
        pendingCalcTimeout.current = setTimeout(() => {
          if (latestDragWaypoints.current) {
            calculateRoute(latestDragWaypoints.current);
            lastRouteCalcTime.current = Date.now();
          }
        }, 150);
      }
    },
    [waypoints, dragInsertIndex, calculateRoute]
  );

  const handleRouteDragEnd = useCallback(() => {
    setDragInsertIndex(null);
    // Clear any pending timeout
    if (pendingCalcTimeout.current) {
      clearTimeout(pendingCalcTimeout.current);
      pendingCalcTimeout.current = null;
    }
    // Final calculation with latest waypoints
    if (latestDragWaypoints.current) {
      calculateRoute(latestDragWaypoints.current);
      latestDragWaypoints.current = null;
    }
  }, [calculateRoute]);

  const handleClear = useCallback(() => {
    setWaypoints([]);
    setRouteGeometry(null);
    setDistance(0);
    setElevation([]);
    setSegmentDistances([]);
    setName('');
    setDescription('');
    setSavedRouteId(null);
  }, []);

  // Context menu handlers
  const handleWaypointContextMenu = useCallback((index: number, x: number, y: number) => {
    setContextMenu({ visible: true, x, y, waypointIndex: index });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleSetAsStart = useCallback(async (index: number) => {
    if (index === 0) return;

    // Remove all waypoints before this one
    const updatedWaypoints = waypoints.slice(index);
    updatedWaypoints[0].type = 'start';

    setWaypoints(updatedWaypoints);
    await calculateRoute(updatedWaypoints);
  }, [waypoints, calculateRoute]);

  const handleSetAsEnd = useCallback(async (index: number) => {
    if (index === waypoints.length - 1) return;

    // Remove all waypoints after this one
    const updatedWaypoints = waypoints.slice(0, index + 1);
    updatedWaypoints[updatedWaypoints.length - 1].type = 'end';
    if (updatedWaypoints.length > 1) {
      updatedWaypoints[0].type = 'start';
      for (let i = 1; i < updatedWaypoints.length - 1; i++) {
        updatedWaypoints[i].type = 'via';
      }
    }

    setWaypoints(updatedWaypoints);
    await calculateRoute(updatedWaypoints);
  }, [waypoints, calculateRoute]);

  const handleSave = async () => {
    if (!routeGeometry || waypoints.length < 2) return;

    setSaving(true);
    const gpxData = generateGPX(waypoints, routeGeometry, name || 'Untitled Route', description);

    const result = await createRoute({
      name: name || 'Untitled Route',
      description: description || undefined,
      distanceM: distance,
      elevationGainM: calculateElevationGain(elevation),
      gpxData,
      waypoints,
      routeCoordinates: routeGeometry,
    });

    setSaving(false);

    if (result) {
      setSavedRouteId(result.id);
    } else {
      alert('Failed to save route. Please check console for errors.');
    }
  };

  const handleExportGPX = () => {
    if (!routeGeometry || waypoints.length < 2) return;

    const gpxData = generateGPX(waypoints, routeGeometry, name || 'Route', description);
    downloadGPX(gpxData, name || 'route');
  };

  const handleImportGPX = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readGPXFile(file);
      const parsed = parseGPX(content);

      if (!parsed) {
        alert('Failed to parse GPX file. Please check the file format.');
        return;
      }

      // Set the imported data
      setName(parsed.name);
      setDescription(parsed.description);
      setWaypoints(parsed.waypoints);
      setRouteGeometry(parsed.trackPoints);
      setDistance(parsed.distance);

      // Fetch elevation for the imported route
      if (parsed.trackPoints.length > 0) {
        setLoadingElevation(true);
        try {
          const elevationData = await getElevationData(parsed.trackPoints);
          setElevation(elevationData);
        } catch (error) {
          console.error('Failed to fetch elevation:', error);
        } finally {
          setLoadingElevation(false);
        }

        // Fly to the route
        if (mapRef.current && parsed.trackPoints.length > 0) {
          const firstPoint = parsed.trackPoints[0];
          mapRef.current.flyTo(firstPoint[0], firstPoint[1], 12);
        }
      }
    } catch (error) {
      console.error('Failed to import GPX:', error);
      alert('Failed to read GPX file.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadRoute = (route: (typeof routes)[0]) => {
    setWaypoints(route.waypoints);
    setName(route.name);
    setDescription(route.description || '');
    setDistance(route.distanceM);
    setShowSavedRoutes(false);
    calculateRoute(route.waypoints);
  };

  const handleLocationSelect = (lng: number, lat: number, zoom?: number) => {
    mapRef.current?.flyTo(lng, lat, zoom);
  };

  const handleProfileChange = (profile: RouteProfile) => {
    setRouteProfile(profile);
    if (waypoints.length >= 2) {
      calculateRoute(waypoints, profile);
    }
  };

  // Hover handlers for map <-> elevation profile sync
  const handleElevationHover = useCallback((position: number | null, coords: [number, number] | null) => {
    setHighlightCoordinate(coords);
  }, []);

  const handleRouteHover = useCallback((position: number | null) => {
    setHighlightPosition(position);
  }, []);

  // Calculate elevation gain
  const calculateElevationGain = (elevations: number[]): number => {
    let gain = 0;
    for (let i = 1; i < elevations.length; i++) {
      const diff = elevations[i] - elevations[i - 1];
      if (diff > 0) gain += diff;
    }
    return Math.round(gain);
  };

  const elevationGain = calculateElevationGain(elevation);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Map and elevation container */}
      <div className="flex-1 flex flex-col relative">
        {/* Location search - top right */}
        <div className="absolute top-4 right-4 z-10">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {/* Route options - top left */}
        <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md p-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Mode:</label>
              <select
                value={routeProfile}
                onChange={(e) => handleProfileChange(e.target.value as RouteProfile)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="cycling">Cycling</option>
                <option value="walking">Walking</option>
                <option value="driving">Driving</option>
              </select>
            </div>
            {routeProfile === 'cycling' && (
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCyclePaths}
                  onChange={(e) => setUseCyclePaths(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Prefer cycle paths
              </label>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapView
            ref={mapRef}
            waypoints={waypoints}
            routeGeometry={routeGeometry}
            onMapClick={handleMapClick}
            onWaypointDrag={handleWaypointDrag}
            onRouteDrag={handleRouteDrag}
            onRouteDragEnd={handleRouteDragEnd}
            onWaypointContextMenu={handleWaypointContextMenu}
            highlightCoordinate={highlightCoordinate}
            onRouteHover={handleRouteHover}
          />
        </div>

        {/* Context menu for waypoints */}
        {contextMenu && (
          <WaypointContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            waypointIndex={contextMenu.waypointIndex}
            waypointType={waypoints[contextMenu.waypointIndex]?.type || 'via'}
            totalWaypoints={waypoints.length}
            onSetAsStart={handleSetAsStart}
            onSetAsEnd={handleSetAsEnd}
            onDelete={handleWaypointRemove}
            onClose={handleCloseContextMenu}
          />
        )}

        {/* Elevation profile at foot of map */}
        {routeGeometry && routeGeometry.length > 0 ? (
          <div className="h-28 min-h-28 max-h-28 flex-shrink-0 bg-white border-t shadow-inner">
            <ElevationProfile
              elevations={elevation}
              distance={distance}
              coordinates={routeGeometry}
              loading={loadingElevation}
              highlightPosition={highlightPosition}
              onHover={handleElevationHover}
            />
          </div>
        ) : (
          <div className="h-10 bg-gray-50 border-t flex items-center justify-center">
            <span className="text-sm text-gray-400">
              Add waypoints to see elevation profile
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="h-8 bg-gray-100 border-t flex items-center justify-between px-4 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Elevation data: Open-Meteo</span>
            <span>Maps: Mapbox</span>
          </div>
          <div>
            {routeGeometry && routeGeometry.length > 0 && (
              <span>{routeGeometry.length.toLocaleString()} route points</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Route Builder</h2>
            <button
              onClick={() => setShowSavedRoutes(!showSavedRoutes)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showSavedRoutes ? 'New Route' : 'Saved Routes'}
            </button>
          </div>
        </div>

        {showSavedRoutes ? (
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Routes</h3>
            {routesLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : routes.length === 0 ? (
              <p className="text-sm text-gray-500">No saved routes yet</p>
            ) : (
              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.id}>
                    <button
                      onClick={() => handleLoadRoute(route)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                    >
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">
                        {(route.distanceM / 1000).toFixed(1)} km
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <RouteControls
                name={name}
                description={description}
                distance={distance}
                waypoints={waypoints}
                segmentDistances={segmentDistances}
                onNameChange={setName}
                onDescriptionChange={setDescription}
                onWaypointRemove={handleWaypointRemove}
                onClear={handleClear}
              />

              {/* Route stats */}
              {distance > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Distance</span>
                      <div className="font-semibold">{(distance / 1000).toFixed(2)} km</div>
                    </div>
                    {elevationGain > 0 && (
                      <div>
                        <span className="text-gray-500">Elevation Gain</span>
                        <div className="font-semibold">{elevationGain} m</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="p-4 border-t space-y-2">
              {savedRouteId ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-100 text-green-700 rounded-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Route Saved
                  </div>
                  <Link
                    to="/routes"
                    className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                  >
                    View My Routes
                  </Link>
                  <button
                    onClick={handleClear}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Create Another Route
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!routeGeometry || waypoints.length < 2 || saving}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Route'}
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleExportGPX}
                  disabled={!routeGeometry || waypoints.length < 2}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export GPX
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Import GPX
                </button>
              </div>
              {/* Hidden file input for GPX import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".gpx,application/gpx+xml"
                onChange={handleImportGPX}
                className="hidden"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
