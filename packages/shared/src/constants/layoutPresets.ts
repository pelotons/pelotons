/**
 * Layout Presets for Priority-Based Screen Layouts
 *
 * Inspired by Wahoo's "Perfect Zoom" and other bike computer UX research.
 * Instead of a fixed grid where all widgets are equal, these presets define
 * priority slots of different sizes - primary (largest), secondary, tertiary, and compact.
 */

import { WidgetType } from '../types/layout';

// =============================================================================
// TYPES
// =============================================================================

/** Size classification for layout slots */
export type SlotSizeClass = 'primary' | 'secondary' | 'tertiary' | 'compact';

/** Layout mode - users can choose between traditional grid or priority-based layouts */
export type LayoutMode = 'grid' | 'priority';

/** Definition of a single slot in a layout preset */
export interface SlotDefinition {
  /** Unique identifier for this slot */
  id: string;
  /** Priority rank (1 = most important, shown largest) */
  priority: number;
  /** Percentage of available height this slot occupies */
  heightPercent: number;
  /** Percentage of available width this slot occupies */
  widthPercent: number;
  /** Size classification affects font sizing and styling */
  sizeClass: SlotSizeClass;
  /** Row index for layout positioning (0-based) */
  row: number;
  /** Column index within the row (0-based) */
  col: number;
}

/** A complete layout preset defining slot arrangement */
export interface LayoutPreset {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short description for UI */
  description: string;
  /** Number of data fields this layout supports */
  fieldCount: number;
  /** Icon name for UI */
  icon: string;
  /** Slot definitions */
  slots: SlotDefinition[];
}

/** Widget assignment to a slot */
export interface SlotAssignment {
  slotId: string;
  widgetType: WidgetType;
}

// =============================================================================
// LAYOUT PRESETS
// =============================================================================

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'focus',
    name: 'Focus',
    description: '2 large metrics for maximum visibility',
    fieldCount: 2,
    icon: 'focus',
    slots: [
      {
        id: 'primary',
        priority: 1,
        heightPercent: 55,
        widthPercent: 100,
        sizeClass: 'primary',
        row: 0,
        col: 0,
      },
      {
        id: 'secondary',
        priority: 2,
        heightPercent: 45,
        widthPercent: 100,
        sizeClass: 'secondary',
        row: 1,
        col: 0,
      },
    ],
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: '1 primary + 2 secondary metrics',
    fieldCount: 3,
    icon: 'balanced',
    slots: [
      {
        id: 'primary',
        priority: 1,
        heightPercent: 45,
        widthPercent: 100,
        sizeClass: 'primary',
        row: 0,
        col: 0,
      },
      {
        id: 'sec-1',
        priority: 2,
        heightPercent: 55,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 0,
      },
      {
        id: 'sec-2',
        priority: 3,
        heightPercent: 55,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 1,
      },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Good balance of detail and readability',
    fieldCount: 6,
    icon: 'standard',
    slots: [
      {
        id: 'primary',
        priority: 1,
        heightPercent: 30,
        widthPercent: 100,
        sizeClass: 'primary',
        row: 0,
        col: 0,
      },
      {
        id: 'sec-1',
        priority: 2,
        heightPercent: 25,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 0,
      },
      {
        id: 'sec-2',
        priority: 3,
        heightPercent: 25,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 1,
      },
      {
        id: 'ter-1',
        priority: 4,
        heightPercent: 45,
        widthPercent: 33.33,
        sizeClass: 'tertiary',
        row: 2,
        col: 0,
      },
      {
        id: 'ter-2',
        priority: 5,
        heightPercent: 45,
        widthPercent: 33.33,
        sizeClass: 'tertiary',
        row: 2,
        col: 1,
      },
      {
        id: 'ter-3',
        priority: 6,
        heightPercent: 45,
        widthPercent: 33.34,
        sizeClass: 'tertiary',
        row: 2,
        col: 2,
      },
    ],
  },
  {
    id: 'dense',
    name: 'Dense',
    description: 'Maximum data for data nerds',
    fieldCount: 9,
    icon: 'dense',
    slots: [
      {
        id: 'primary',
        priority: 1,
        heightPercent: 25,
        widthPercent: 100,
        sizeClass: 'primary',
        row: 0,
        col: 0,
      },
      {
        id: 'sec-1',
        priority: 2,
        heightPercent: 22,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 0,
      },
      {
        id: 'sec-2',
        priority: 3,
        heightPercent: 22,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 1,
      },
      {
        id: 'ter-1',
        priority: 4,
        heightPercent: 22,
        widthPercent: 50,
        sizeClass: 'tertiary',
        row: 2,
        col: 0,
      },
      {
        id: 'ter-2',
        priority: 5,
        heightPercent: 22,
        widthPercent: 50,
        sizeClass: 'tertiary',
        row: 2,
        col: 1,
      },
      {
        id: 'comp-1',
        priority: 6,
        heightPercent: 31,
        widthPercent: 25,
        sizeClass: 'compact',
        row: 3,
        col: 0,
      },
      {
        id: 'comp-2',
        priority: 7,
        heightPercent: 31,
        widthPercent: 25,
        sizeClass: 'compact',
        row: 3,
        col: 1,
      },
      {
        id: 'comp-3',
        priority: 8,
        heightPercent: 31,
        widthPercent: 25,
        sizeClass: 'compact',
        row: 3,
        col: 2,
      },
      {
        id: 'comp-4',
        priority: 9,
        heightPercent: 31,
        widthPercent: 25,
        sizeClass: 'compact',
        row: 3,
        col: 3,
      },
    ],
  },
  {
    id: 'quad',
    name: 'Quad',
    description: '4 equal medium-sized metrics',
    fieldCount: 4,
    icon: 'quad',
    slots: [
      {
        id: 'slot-1',
        priority: 1,
        heightPercent: 50,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 0,
        col: 0,
      },
      {
        id: 'slot-2',
        priority: 2,
        heightPercent: 50,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 0,
        col: 1,
      },
      {
        id: 'slot-3',
        priority: 3,
        heightPercent: 50,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 0,
      },
      {
        id: 'slot-4',
        priority: 4,
        heightPercent: 50,
        widthPercent: 50,
        sizeClass: 'secondary',
        row: 1,
        col: 1,
      },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Get a layout preset by ID */
export function getLayoutPresetById(id: string): LayoutPreset | undefined {
  return LAYOUT_PRESETS.find((preset) => preset.id === id);
}

/** Get slots for a preset, optionally limited by zoom level (returns top N by priority) */
export function getSlotsForZoomLevel(
  preset: LayoutPreset,
  zoomLevel: number
): SlotDefinition[] {
  if (zoomLevel >= preset.fieldCount) {
    return preset.slots;
  }
  return preset.slots
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .slice(0, zoomLevel);
}

/** Calculate font size multiplier based on slot size class */
export function getFontSizeMultiplier(sizeClass: SlotSizeClass): number {
  switch (sizeClass) {
    case 'primary':
      return 1.8;
    case 'secondary':
      return 1.2;
    case 'tertiary':
      return 1.0;
    case 'compact':
      return 0.75;
  }
}

/** Default slot assignments for common activity types */
export const DEFAULT_SLOT_ASSIGNMENTS: Record<string, Record<string, WidgetType>> = {
  road_racing: {
    primary: 'power',
    'sec-1': 'heart_rate',
    'sec-2': 'speed',
    'ter-1': 'cadence',
    'ter-2': 'time_elapsed',
    'ter-3': 'distance',
  },
  climbing: {
    primary: 'grade',
    'sec-1': 'power',
    'sec-2': 'vam',
    'ter-1': 'elevation_gain',
    'ter-2': 'heart_rate',
    'ter-3': 'distance_remaining',
  },
  indoor_training: {
    primary: 'power',
    'sec-1': 'cadence',
    'sec-2': 'heart_rate',
    'ter-1': 'time_elapsed',
    'ter-2': 'power_avg',
    'ter-3': 'calories',
  },
  gravel: {
    primary: 'speed',
    'sec-1': 'distance',
    'sec-2': 'time_elapsed',
    'ter-1': 'elevation_gain',
    'ter-2': 'heart_rate',
    'ter-3': 'battery_level',
  },
  commute: {
    primary: 'time_of_day',
    secondary: 'time_eta',
  },
};
