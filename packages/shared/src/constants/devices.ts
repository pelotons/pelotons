export interface DevicePreset {
  id: string;
  name: string;
  screenWidth: number;
  screenHeight: number;
  suggestedGrid: {
    columns: number;
    rows: number;
  };
}

export const DEVICE_PRESETS: Record<string, DevicePreset> = {
  iphone_se: {
    id: 'iphone_se',
    name: 'iPhone SE',
    screenWidth: 375,
    screenHeight: 667,
    suggestedGrid: { columns: 2, rows: 3 },
  },
  iphone_14: {
    id: 'iphone_14',
    name: 'iPhone 14',
    screenWidth: 390,
    screenHeight: 844,
    suggestedGrid: { columns: 3, rows: 4 },
  },
  iphone_15: {
    id: 'iphone_15',
    name: 'iPhone 15',
    screenWidth: 393,
    screenHeight: 852,
    suggestedGrid: { columns: 3, rows: 4 },
  },
  iphone_15_pro_max: {
    id: 'iphone_15_pro_max',
    name: 'iPhone 15 Pro Max',
    screenWidth: 430,
    screenHeight: 932,
    suggestedGrid: { columns: 3, rows: 5 },
  },
  iphone_16: {
    id: 'iphone_16',
    name: 'iPhone 16',
    screenWidth: 393,
    screenHeight: 852,
    suggestedGrid: { columns: 3, rows: 4 },
  },
  iphone_16_pro_max: {
    id: 'iphone_16_pro_max',
    name: 'iPhone 16 Pro Max',
    screenWidth: 440,
    screenHeight: 956,
    suggestedGrid: { columns: 3, rows: 5 },
  },
};

export const DEFAULT_DEVICE = 'iphone_15';

export const DEVICE_PRESET_LIST = Object.values(DEVICE_PRESETS);

export const MIN_GRID_COLUMNS = 1;
export const MAX_GRID_COLUMNS = 4;
export const MIN_GRID_ROWS = 1;
export const MAX_GRID_ROWS = 8;
