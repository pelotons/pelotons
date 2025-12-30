// =============================================================================
// WIDGET CATEGORIES
// =============================================================================

export type WidgetCategory =
  | 'speed'
  | 'power'
  | 'heart_rate'
  | 'cadence'
  | 'distance'
  | 'time'
  | 'elevation'
  | 'navigation'
  | 'performance'
  | 'gears'
  | 'environment'
  | 'graphs'
  | 'maps';

// =============================================================================
// WIDGET TYPES BY CATEGORY
// =============================================================================

// Speed widgets
export type SpeedWidgetType =
  | 'speed'
  | 'speed_avg'
  | 'speed_max'
  | 'speed_lap'
  | 'speed_last_lap'
  | 'speed_3s'
  | 'pace'
  | 'pace_avg';

// Power widgets
export type PowerWidgetType =
  | 'power'
  | 'power_3s'
  | 'power_10s'
  | 'power_30s'
  | 'power_avg'
  | 'power_max'
  | 'power_lap'
  | 'power_last_lap'
  | 'power_normalized'
  | 'power_weighted_avg'
  | 'power_balance'
  | 'power_per_kg'
  | 'power_ftp_percent'
  | 'power_zone'
  | 'power_if'
  | 'torque'
  | 'pedal_smoothness'
  | 'torque_effectiveness';

// Heart rate widgets
export type HeartRateWidgetType =
  | 'heart_rate'
  | 'heart_rate_avg'
  | 'heart_rate_max'
  | 'heart_rate_lap'
  | 'heart_rate_last_lap'
  | 'heart_rate_zone'
  | 'heart_rate_percent_max'
  | 'heart_rate_percent_hrr'
  | 'heart_rate_graph';

// Cadence widgets
export type CadenceWidgetType =
  | 'cadence'
  | 'cadence_avg'
  | 'cadence_max'
  | 'cadence_lap';

// Distance widgets
export type DistanceWidgetType =
  | 'distance'
  | 'distance_lap'
  | 'distance_last_lap'
  | 'distance_remaining'
  | 'distance_to_destination'
  | 'odometer';

// Time widgets
export type TimeWidgetType =
  | 'time_elapsed'
  | 'time_lap'
  | 'time_last_lap'
  | 'time_avg_lap'
  | 'time_moving'
  | 'time_stopped'
  | 'time_of_day'
  | 'time_eta'
  | 'time_remaining'
  | 'time_to_destination'
  | 'time_sunrise'
  | 'time_sunset'
  | 'laps';

// Elevation widgets
export type ElevationWidgetType =
  | 'elevation'
  | 'elevation_gain'
  | 'elevation_loss'
  | 'elevation_lap_gain'
  | 'elevation_lap_loss'
  | 'elevation_remaining'
  | 'grade'
  | 'grade_avg'
  | 'grade_max'
  | 'vam'
  | 'vam_30s'
  | 'vam_lap';

// Navigation widgets
export type NavigationWidgetType =
  | 'heading'
  | 'bearing'
  | 'course_point_distance'
  | 'course_point_name'
  | 'turn_distance'
  | 'turn_direction'
  | 'off_course'
  | 'gps_accuracy'
  | 'gps_signal';

// Performance widgets
export type PerformanceWidgetType =
  | 'calories'
  | 'calories_remaining'
  | 'kilojoules'
  | 'tss'
  | 'training_load'
  | 'performance_condition'
  | 'stamina'
  | 'stamina_potential'
  | 'aerobic_te'
  | 'anaerobic_te';

// Gear widgets
export type GearWidgetType =
  | 'gear'
  | 'gear_front'
  | 'gear_rear'
  | 'gear_ratio'
  | 'gear_combo'
  | 'gear_battery'
  | 'di2_battery';

// Environment widgets
export type EnvironmentWidgetType =
  | 'temperature'
  | 'humidity'
  | 'wind_speed'
  | 'wind_direction'
  | 'weather'
  | 'battery_level';

// Graph widgets
export type GraphWidgetType =
  | 'graph_power'
  | 'graph_heart_rate'
  | 'graph_speed'
  | 'graph_elevation'
  | 'graph_cadence'
  | 'graph_grade';

// Map widgets
export type MapWidgetType =
  | 'map'
  | 'map_mini'
  | 'climb_profile'
  | 'elevation_profile'
  | 'route_preview';

// Combined widget type
export type WidgetType =
  | SpeedWidgetType
  | PowerWidgetType
  | HeartRateWidgetType
  | CadenceWidgetType
  | DistanceWidgetType
  | TimeWidgetType
  | ElevationWidgetType
  | NavigationWidgetType
  | PerformanceWidgetType
  | GearWidgetType
  | EnvironmentWidgetType
  | GraphWidgetType
  | MapWidgetType;

// =============================================================================
// WIDGET CONFIGURATION
// =============================================================================

export type FontSizePreference = 'auto' | 'small' | 'medium' | 'large';

export interface WidgetConfig {
  unit?: 'metric' | 'imperial';
  showLabel?: boolean;
  showAverage?: boolean;
  showMax?: boolean;
  showZone?: boolean;
  zoneColors?: boolean;
  fontSize?: 'small' | 'medium' | 'large'; // Legacy - use fontSizePreference
  fontSizePreference?: FontSizePreference; // 'auto' scales to fit widget
  precision?: number;
  smoothingSeconds?: number;
  targetValue?: number;
  alertHigh?: number;
  alertLow?: number;
}

export interface Widget {
  id: string;
  type: WidgetType;
  x: number; // Grid column (0-based)
  y: number; // Grid row (0-based)
  width: number; // Grid columns span
  height: number; // Grid rows span
  config?: WidgetConfig;
}

// =============================================================================
// LAYOUT TYPES
// =============================================================================

export type ScreenType = 'map' | 'data' | 'climb' | 'workout' | 'summary';

export interface Layout {
  id: string;
  userId: string;
  name: string;
  screenType: ScreenType;
  widgets: Widget[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LayoutInsert {
  name: string;
  screenType: ScreenType;
  widgets: Widget[];
  isActive?: boolean;
}

export interface LayoutUpdate {
  name?: string;
  widgets?: Widget[];
  isActive?: boolean;
}

// =============================================================================
// DEFAULT SCREEN PROFILES
// =============================================================================

export type ScreenProfile =
  | 'road_racing'
  | 'climbing'
  | 'training'
  | 'endurance'
  | 'navigation'
  | 'indoor'
  | 'mtb'
  | 'gravel'
  | 'commute'
  | 'minimal';
