import { useState, useEffect, useCallback } from 'react';
import { supabase, DbRoute } from '@/lib/supabase';
import { Route, RouteInsert, Waypoint } from '@peloton/shared';
import { useAuth } from '@/components/Auth/AuthProvider';

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

export function useRoutes() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    if (!user) {
      setRoutes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setRoutes([]);
    } else {
      setRoutes((data as DbRoute[]).map(dbToRoute));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const createRoute = async (route: RouteInsert): Promise<Route | null> => {
    if (!user) return null;

    const baseData = {
      user_id: user.id,
      name: route.name,
      description: route.description,
      distance_m: route.distanceM,
      elevation_gain_m: route.elevationGainM,
      gpx_data: route.gpxData,
      waypoints: route.waypoints,
    };

    // Try with route_coordinates first (requires migration 002)
    let insertData: Record<string, unknown> = { ...baseData };
    if (route.routeCoordinates) {
      insertData.route_coordinates = route.routeCoordinates;
    }

    let { data, error: insertError } = await supabase
      .from('routes')
      .insert(insertData)
      .select()
      .single();

    // If failed due to missing column, retry without route_coordinates
    if (insertError?.message?.includes('route_coordinates')) {
      console.warn('route_coordinates column not found, saving without it. Run migration 002 to enable realistic thumbnails.');
      const { data: retryData, error: retryError } = await supabase
        .from('routes')
        .insert(baseData)
        .select()
        .single();
      data = retryData;
      insertError = retryError;
    }

    if (insertError) {
      console.error('Failed to create route:', insertError);
      setError(insertError.message);
      return null;
    }

    const newRoute = dbToRoute(data as DbRoute);
    setRoutes((prev) => [newRoute, ...prev]);
    return newRoute;
  };

  const updateRoute = async (
    id: string,
    updates: Partial<RouteInsert>
  ): Promise<Route | null> => {
    const baseData: Record<string, unknown> = {};
    if (updates.name !== undefined) baseData.name = updates.name;
    if (updates.description !== undefined) baseData.description = updates.description;
    if (updates.distanceM !== undefined) baseData.distance_m = updates.distanceM;
    if (updates.elevationGainM !== undefined) baseData.elevation_gain_m = updates.elevationGainM;
    if (updates.gpxData !== undefined) baseData.gpx_data = updates.gpxData;
    if (updates.waypoints !== undefined) baseData.waypoints = updates.waypoints;

    const updateData = { ...baseData };
    if (updates.routeCoordinates !== undefined) {
      updateData.route_coordinates = updates.routeCoordinates;
    }

    let { data, error: updateError } = await supabase
      .from('routes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    // If failed due to missing column, retry without route_coordinates
    if (updateError?.message?.includes('route_coordinates')) {
      console.warn('route_coordinates column not found, updating without it.');
      const { data: retryData, error: retryError } = await supabase
        .from('routes')
        .update(baseData)
        .eq('id', id)
        .select()
        .single();
      data = retryData;
      updateError = retryError;
    }

    if (updateError) {
      console.error('Failed to update route:', updateError);
      setError(updateError.message);
      return null;
    }

    const updatedRoute = dbToRoute(data as DbRoute);
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? updatedRoute : r))
    );
    return updatedRoute;
  };

  const deleteRoute = async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    setRoutes((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  return {
    routes,
    loading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    refetch: fetchRoutes,
  };
}
