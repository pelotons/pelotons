import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabasePublishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Database types matching our schema
export interface DbLayout {
  id: string;
  user_id: string;
  name: string;
  screen_type: 'map' | 'data';
  widgets: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbRoute {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  distance_m: number;
  elevation_gain_m: number | null;
  gpx_data: string;
  waypoints: unknown;
  route_coordinates: unknown;
  created_at: string;
  updated_at: string;
}

export interface DbRide {
  id: string;
  user_id: string;
  route_id: string | null;
  name: string | null;
  started_at: string;
  ended_at: string | null;
  distance_m: number;
  elapsed_time_s: number;
  moving_time_s: number;
  avg_speed_ms: number | null;
  max_speed_ms: number | null;
  avg_power: number | null;
  max_power: number | null;
  avg_hr: number | null;
  max_hr: number | null;
  elevation_gain_m: number | null;
  gpx_path: string | null;
  created_at: string;
}

export interface DbSensor {
  id: string;
  user_id: string;
  name: string;
  sensor_type: 'heart_rate' | 'power' | 'cadence' | 'speed' | 'sram_axs';
  ble_id: string;
  ble_name: string | null;
  last_connected_at: string | null;
  created_at: string;
}

export interface DbRouteCollection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCollectionRoute {
  id: string;
  collection_id: string;
  route_id: string;
  position: number;
  added_at: string;
}

export interface DbDataProfile {
  id: string;
  user_id: string;
  name: string;
  device_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfileScreen {
  id: string;
  profile_id: string;
  name: string;
  screen_type: 'data' | 'map';
  position: number;
  grid_columns: number;
  grid_rows: number;
  widgets: unknown;
  created_at: string;
  updated_at: string;
}
