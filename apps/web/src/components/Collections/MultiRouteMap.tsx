import { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapboxToken, MAP_STYLES } from '@/lib/mapbox';
import { Route } from '@peloton/shared';

mapboxgl.accessToken = mapboxToken;

const ROUTE_COLORS = ['#0066cc', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d', '#ca8a04'];

interface MultiRouteMapProps {
  routes: Route[];
  highlightedRouteId?: string | null;
  onRouteClick?: (routeId: string) => void;
}

export function MultiRouteMap({ routes, highlightedRouteId, onRouteClick }: MultiRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  const getRouteColor = useCallback((index: number) => {
    return ROUTE_COLORS[index % ROUTE_COLORS.length];
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.outdoors,
      center: [0, 20],
      zoom: 2,
      projection: 'mercator',
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add sources and layers for each route
      routes.forEach((route, index) => {
        const coords = route.routeCoordinates || [];
        if (coords.length === 0) return;

        const sourceId = `route-${route.id}`;
        const layerId = `route-layer-${route.id}`;
        const hitLayerId = `route-hit-${route.id}`;
        const color = getRouteColor(index);

        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { routeId: route.id, name: route.name },
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        });

        // Main route line
        map.current!.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': highlightedRouteId === route.id ? 6 : 4,
            'line-opacity': highlightedRouteId && highlightedRouteId !== route.id ? 0.4 : 0.8,
          },
        });

        // Invisible hit area for clicking
        map.current!.addLayer({
          id: hitLayerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': 20,
            'line-opacity': 0,
          },
        });

        // Click handler
        map.current!.on('click', hitLayerId, (e) => {
          if (onRouteClick) {
            onRouteClick(route.id);
          }

          // Show popup
          const coordinates = e.lngLat;
          const formatDistance = (m: number) => m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;

          if (popup.current) popup.current.remove();
          popup.current = new mapboxgl.Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: 600; margin-bottom: 4px;">${route.name}</h3>
                <p style="font-size: 14px; color: #666; margin: 0;">
                  ${formatDistance(route.distanceM)}
                  ${route.elevationGainM ? ` · +${route.elevationGainM}m` : ''}
                </p>
              </div>
            `)
            .addTo(map.current!);
        });

        // Cursor change on hover
        map.current!.on('mouseenter', hitLayerId, () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });
        map.current!.on('mouseleave', hitLayerId, () => {
          map.current!.getCanvas().style.cursor = '';
        });
      });

      // Fit bounds to all routes
      if (routes.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        routes.forEach((route) => {
          route.routeCoordinates?.forEach((coord) => bounds.extend(coord));
        });
        if (!bounds.isEmpty()) {
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      }
    });

    return () => {
      if (popup.current) popup.current.remove();
      map.current?.remove();
      map.current = null;
    };
  }, [routes, highlightedRouteId, onRouteClick, getRouteColor]);

  // Update route highlighting when highlightedRouteId changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    routes.forEach((route, index) => {
      const layerId = `route-layer-${route.id}`;
      if (!map.current!.getLayer(layerId)) return;

      const isHighlighted = highlightedRouteId === route.id;
      const isDimmed = highlightedRouteId && highlightedRouteId !== route.id;

      map.current!.setPaintProperty(layerId, 'line-width', isHighlighted ? 6 : 4);
      map.current!.setPaintProperty(layerId, 'line-opacity', isDimmed ? 0.4 : 0.8);
    });
  }, [highlightedRouteId, routes]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '400px' }}
    />
  );
}
