import type { WidgetType } from '../types/layout';

export interface WidgetDefinition {
  label: string;
  unit: string;
  minWidth: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  requiresSensor?: boolean;
  sensorType?: string;
}

export const WIDGET_DEFINITIONS: Record<WidgetType, WidgetDefinition> = {
  heart_rate: {
    label: 'Heart Rate',
    unit: 'bpm',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: true,
    sensorType: 'heart_rate',
  },
  power: {
    label: 'Power',
    unit: 'W',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: true,
    sensorType: 'power',
  },
  speed: {
    label: 'Speed',
    unit: 'km/h',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: false,
  },
  cadence: {
    label: 'Cadence',
    unit: 'rpm',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: true,
    sensorType: 'cadence',
  },
  time: {
    label: 'Time',
    unit: '',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
    requiresSensor: false,
  },
  distance: {
    label: 'Distance',
    unit: 'km',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: false,
  },
  elevation: {
    label: 'Elevation',
    unit: 'm',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: false,
  },
  gear: {
    label: 'Gear',
    unit: '',
    minWidth: 1,
    minHeight: 1,
    defaultWidth: 1,
    defaultHeight: 1,
    requiresSensor: true,
    sensorType: 'sram_axs',
  },
  map_mini: {
    label: 'Mini Map',
    unit: '',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 2,
    defaultHeight: 2,
    requiresSensor: false,
  },
} as const;

// Data screen grid configuration
export const DATA_SCREEN_GRID = {
  columns: 3,
  rows: 4,
} as const;

// Default layouts
export const DEFAULT_DATA_LAYOUT = {
  name: 'Default',
  screenType: 'data' as const,
  widgets: [
    { id: 'w1', type: 'speed' as const, x: 0, y: 0, width: 1, height: 1 },
    { id: 'w2', type: 'heart_rate' as const, x: 1, y: 0, width: 1, height: 1 },
    { id: 'w3', type: 'power' as const, x: 2, y: 0, width: 1, height: 1 },
    { id: 'w4', type: 'time' as const, x: 0, y: 1, width: 2, height: 1 },
    { id: 'w5', type: 'distance' as const, x: 2, y: 1, width: 1, height: 1 },
    { id: 'w6', type: 'cadence' as const, x: 0, y: 2, width: 1, height: 1 },
    { id: 'w7', type: 'elevation' as const, x: 1, y: 2, width: 1, height: 1 },
    { id: 'w8', type: 'gear' as const, x: 2, y: 2, width: 1, height: 1 },
  ],
  isActive: true,
};

// LCD color palette
export const LCD_COLORS = {
  background: '#e5e5e0',
  text: '#222222',
  textSecondary: '#666666',
  border: '#999999',
  accentBlue: '#0066cc',
  accentGreen: '#22c55e',
  accentRed: '#ef4444',
} as const;
