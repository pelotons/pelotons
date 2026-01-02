import { Widget } from './layout';
import { LayoutMode, SlotAssignment } from '../constants/layoutPresets';

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

  // Grid mode fields (traditional equal-cell grid)
  gridColumns: number;   // Number of columns in the grid
  gridRows: number;      // Number of rows in the grid
  widgets: Widget[];     // Only used for 'data' screens in grid mode

  // Priority layout mode fields (new Wahoo-inspired layouts)
  layoutMode?: LayoutMode;         // 'grid' (default) or 'priority'
  layoutPresetId?: string;         // ID of the layout preset (e.g., 'focus', 'standard')
  slotAssignments?: SlotAssignment[]; // Widget assignments to slots

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
  // Priority layout mode fields
  layoutMode?: LayoutMode;
  layoutPresetId?: string;
  slotAssignments?: SlotAssignment[];
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
  // Priority layout mode fields
  layoutMode?: LayoutMode;
  layoutPresetId?: string;
  slotAssignments?: SlotAssignment[];
}
