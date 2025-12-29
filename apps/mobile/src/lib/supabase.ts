import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabasePublishableKey = Constants.expoConfig?.extra?.supabasePublishableKey;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Missing Supabase config. Check SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl || '', supabasePublishableKey || '');

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
