import { Widget } from './layout';

/**
 * Data Profile - A collection of screens for a specific riding style
 * e.g., "Road Cycling", "Mountain Biking", "Indoor Training"
 */
export interface DataProfile {
  id: string;
  userId: string;
  name: string;
  deviceType: string;  // References DEVICE_PRESETS key
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile Screen - A single screen within a profile
 * Users scroll through screens in position order while riding
 */
export interface ProfileScreen {
  id: string;
  profileId: string;
  name: string;
  screenType: 'data' | 'map';
  position: number;      // Order in the scroll sequence (0-based)
  gridColumns: number;   // Number of columns in the grid
  gridRows: number;      // Number of rows in the grid
  widgets: Widget[];     // Only used for 'data' screens
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile with its screens included
 */
export interface DataProfileWithScreens extends DataProfile {
  screens: ProfileScreen[];
}

/**
 * Input type for creating a new profile
 */
export interface DataProfileInsert {
  name: string;
  deviceType: string;
  isActive?: boolean;
}

/**
 * Input type for updating a profile
 */
export interface DataProfileUpdate {
  name?: string;
  deviceType?: string;
  isActive?: boolean;
}

/**
 * Input type for creating a new screen
 */
export interface ProfileScreenInsert {
  profileId: string;
  name: string;
  screenType: 'data' | 'map';
  position?: number;
  gridColumns?: number;
  gridRows?: number;
  widgets?: Widget[];
}

/**
 * Input type for updating a screen
 */
export interface ProfileScreenUpdate {
  name?: string;
  position?: number;
  gridColumns?: number;
  gridRows?: number;
  widgets?: Widget[];
}
