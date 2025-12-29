import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapboxToken, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLES, getUserLocation } from '@/lib/mapbox';
import { Waypoint } from '@peloton/shared';

mapboxgl.accessToken = mapboxToken;

export interface MapViewHandle {
  flyTo: (lng: number, lat: number, zoom?: number) => void;
}

interface MapViewProps {
  waypoints: Waypoint[];
  routeGeometry: [number, number][] | null;
  onMapClick: (lat: number, lng: number) => void;
  onWaypointDrag?: (index: number, lat: number, lng: number) => void;
  onRouteDrag?: (insertAfterIndex: number, lat: number, lng: number) => void;
  onRouteDragEnd?: () => void;
  onWaypointContextMenu?: (index: number, x: number, y: number) => void;
  requestGeolocation?: boolean;
  /** Coordinate to highlight on the map (from elevation profile hover) */
  highlightCoordinate?: [number, number] | null;
  /** Called when hovering on route with position (0-1) along route */
  onRouteHover?: (position: number | null) => void;
}

export const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView({
  waypoints,
  routeGeometry,
  onMapClick,
  onWaypointDrag,
  onRouteDrag,
  onRouteDragEnd,
  onWaypointContextMenu,
  requestGeolocation = true,
  highlightCoordinate,
  onRouteHover,
}, ref) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const dragMarker = useRef<mapboxgl.Marker | null>(null);
  const highlightMarker = useRef<mapboxgl.Marker | null>(null);
  const isDraggingRoute = useRef(false);
  const dragSegmentIndex = useRef(0);
  const onMapClickRef = useRef(onMapClick);
  const onRouteDragRef = useRef(onRouteDrag);
  const onRouteDragEndRef = useRef(onRouteDragEnd);
  const onRouteHoverRef = useRef(onRouteHover);
  const waypointsRef = useRef(waypoints);
  const routeGeometryRef = useRef(routeGeometry);
  const hasRequestedGeolocation = useRef(false);

  // Expose flyTo method to parent
  useImperativeHandle(ref, () => ({
    flyTo: (lng: number, lat: number, zoom?: number) => {
      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: zoom ?? map.current.getZoom(),
          duration: 1500,
        });
      }
    },
  }));

  // Keep refs updated with latest callbacks and data
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    onRouteDragRef.current = onRouteDrag;
  }, [onRouteDrag]);

  useEffect(() => {
    onRouteDragEndRef.current = onRouteDragEnd;
  }, [onRouteDragEnd]);

  useEffect(() => {
    onRouteHoverRef.current = onRouteHover;
  }, [onRouteHover]);

  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);

  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
  }, [routeGeometry]);

  // Find position (0-1) along route from coordinates
  const findPositionOnRoute = useCallback((lng: number, lat: number): number => {
    const geometry = routeGeometryRef.current;
    if (!geometry || geometry.length < 2) return 0;

    let minDist = Infinity;
    let closestIdx = 0;

    for (let i = 0; i < geometry.length; i++) {
      const [gLng, gLat] = geometry[i];
      const dist = Math.sqrt(Math.pow(gLng - lng, 2) + Math.pow(gLat - lat, 2));
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }

    return closestIdx / (geometry.length - 1);
  }, []);

  // Find which waypoint segment a route point is closest to
  const findSegmentIndex = useCallback((clickLng: number, clickLat: number): number => {
    const geometry = routeGeometryRef.current;
    const wps = waypointsRef.current;
    if (!geometry || geometry.length < 2 || wps.length < 2) return 0;

    // Find the closest point on the route to the click
    let minDist = Infinity;
    let closestRouteIdx = 0;

    for (let i = 0; i < geometry.length; i++) {
      const [lng, lat] = geometry[i];
      const dist = Math.sqrt(Math.pow(lng - clickLng, 2) + Math.pow(lat - clickLat, 2));
      if (dist < minDist) {
        minDist = dist;
        closestRouteIdx = i;
      }
    }

    // Now figure out which waypoint segment this falls into
    // We need to find cumulative distances along the route to each waypoint
    const waypointRouteIndices: number[] = [];
    for (const wp of wps) {
      let minWpDist = Infinity;
      let closestIdx = 0;
      for (let i = 0; i < geometry.length; i++) {
        const [lng, lat] = geometry[i];
        const dist = Math.sqrt(Math.pow(lng - wp.lng, 2) + Math.pow(lat - wp.lat, 2));
        if (dist < minWpDist) {
          minWpDist = dist;
          closestIdx = i;
        }
      }
      waypointRouteIndices.push(closestIdx);
    }

    // Find which segment the click is in
    for (let i = 0; i < waypointRouteIndices.length - 1; i++) {
      if (closestRouteIdx >= waypointRouteIndices[i] && closestRouteIdx <= waypointRouteIndices[i + 1]) {
        return i;
      }
    }

    return Math.max(0, wps.length - 2);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.outdoors,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', async () => {
      // Request user's location on first load
      if (requestGeolocation && !hasRequestedGeolocation.current) {
        hasRequestedGeolocation.current = true;
        const userLocation = await getUserLocation();
        if (userLocation && map.current) {
          map.current.flyTo({
            center: [userLocation.lng, userLocation.lat],
            zoom: 14,
            duration: 1500,
          });
        }
      }
      // Add route layer - use existing routeGeometry if available
      const initialCoords = routeGeometryRef.current || [];
      map.current!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: initialCoords,
          },
        },
      });

      // Fit bounds to initial route if available
      if (initialCoords.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        initialCoords.forEach((coord) => bounds.extend(coord));
        map.current!.fitBounds(bounds, { padding: 50 });
      }

      map.current!.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0066cc',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });

      // Add invisible wider hit area for easier clicking on route
      map.current!.addLayer({
        id: 'route-hit',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0066cc',
          'line-width': 20,
          'line-opacity': 0,
        },
      });

      // Change cursor on route hover and emit position
      map.current!.on('mouseenter', 'route-hit', () => {
        if (!isDraggingRoute.current) {
          map.current!.getCanvas().style.cursor = 'grab';
        }
      });

      map.current!.on('mousemove', 'route-hit', (e) => {
        if (!isDraggingRoute.current && onRouteHoverRef.current) {
          const position = findPositionOnRoute(e.lngLat.lng, e.lngLat.lat);
          onRouteHoverRef.current(position);
        }
      });

      map.current!.on('mouseleave', 'route-hit', () => {
        if (!isDraggingRoute.current) {
          map.current!.getCanvas().style.cursor = '';
          if (onRouteHoverRef.current) {
            onRouteHoverRef.current(null);
          }
        }
      });

      // Handle mousedown on route to start dragging
      map.current!.on('mousedown', 'route-hit', (e) => {
        if (waypointsRef.current.length < 2) return;

        e.preventDefault();
        isDraggingRoute.current = true;
        dragSegmentIndex.current = findSegmentIndex(e.lngLat.lng, e.lngLat.lat);

        map.current!.getCanvas().style.cursor = 'grabbing';

        // Disable map dragging while we drag the route
        map.current!.dragPan.disable();

        // Create a temporary drag marker
        const el = document.createElement('div');
        el.style.cssText = `
          width: 20px;
          height: 20px;
          background: #0066cc;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        `;

        dragMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current!);

        // Trigger initial drag
        if (onRouteDragRef.current) {
          onRouteDragRef.current(dragSegmentIndex.current, e.lngLat.lat, e.lngLat.lng);
        }
      });
    });

    // Handle mousemove for route dragging
    map.current.on('mousemove', (e) => {
      if (!isDraggingRoute.current || !dragMarker.current) return;

      dragMarker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);

      if (onRouteDragRef.current) {
        onRouteDragRef.current(dragSegmentIndex.current, e.lngLat.lat, e.lngLat.lng);
      }
    });

    // Handle mouseup to end route dragging
    map.current.on('mouseup', () => {
      if (!isDraggingRoute.current) return;

      isDraggingRoute.current = false;
      map.current!.getCanvas().style.cursor = '';
      map.current!.dragPan.enable();

      // Remove the drag marker
      if (dragMarker.current) {
        dragMarker.current.remove();
        dragMarker.current = null;
      }

      if (onRouteDragEndRef.current) {
        onRouteDragEndRef.current();
      }
    });

    // Handle map clicks - use ref to avoid stale closure
    map.current.on('click', (e) => {
      // Ignore if we just finished dragging
      if (isDraggingRoute.current) return;

      // Check if click was on route
      const features = map.current?.queryRenderedFeatures(e.point, { layers: ['route-hit'] });
      if (features && features.length > 0) return;

      onMapClickRef.current(e.lngLat.lat, e.lngLat.lng);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update route geometry
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeGeometry || [],
        },
      });
    }

    // Fit bounds to route
    if (routeGeometry && routeGeometry.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      routeGeometry.forEach((coord) => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [routeGeometry]);

  // Update waypoint markers
  useEffect(() => {
    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (!map.current) return;

    waypoints.forEach((waypoint, index) => {
      const el = document.createElement('div');
      el.className = 'waypoint-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background: ${index === 0 ? '#22c55e' : index === waypoints.length - 1 ? '#ef4444' : '#0066cc'};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;
      el.textContent = index === 0 ? 'S' : index === waypoints.length - 1 ? 'E' : String(index);

      // Prevent marker clicks from adding new waypoints
      el.addEventListener('click', (e) => e.stopPropagation());

      // Handle right-click for context menu
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onWaypointContextMenu) {
          onWaypointContextMenu(index, e.clientX, e.clientY);
        }
      });

      const marker = new mapboxgl.Marker({
        element: el,
        draggable: !!onWaypointDrag,
      })
        .setLngLat([waypoint.lng, waypoint.lat])
        .addTo(map.current!);

      if (onWaypointDrag) {
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          onWaypointDrag(index, lngLat.lat, lngLat.lng);
        });
      }

      markers.current.push(marker);
    });
  }, [waypoints, onWaypointDrag, onWaypointContextMenu]);

  // Manage highlight marker (from elevation profile hover)
  useEffect(() => {
    if (!map.current) return;

    if (highlightCoordinate) {
      // Create or update highlight marker
      if (!highlightMarker.current) {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 16px;
          height: 16px;
          background: #f97316;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          pointer-events: none;
        `;
        highlightMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat(highlightCoordinate)
          .addTo(map.current);
      } else {
        highlightMarker.current.setLngLat(highlightCoordinate);
      }
    } else {
      // Remove highlight marker
      if (highlightMarker.current) {
        highlightMarker.current.remove();
        highlightMarker.current = null;
      }
    }
  }, [highlightCoordinate]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
});
