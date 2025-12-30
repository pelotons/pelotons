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

// Frame specifications for realistic phone simulator rendering
export type NotchType = 'none' | 'notch' | 'dynamic_island';

export interface DeviceFrameSpec {
  // Physical dimensions (frame including bezel)
  frameWidth: number;
  frameHeight: number;
  // Screen dimensions (actual display area)
  screenWidth: number;
  screenHeight: number;
  // Corner radii
  frameCornerRadius: number;
  screenCornerRadius: number;
  // Notch/Dynamic Island
  notchType: NotchType;
  notchWidth: number;
  notchHeight: number;
  // Safe area insets
  safeAreaTop: number;
  safeAreaBottom: number;
  // Bezel width (frame - screen) / 2
  bezelWidth: number;
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

// Frame specifications for realistic iPhone simulator rendering
export const DEVICE_FRAME_SPECS: Record<string, DeviceFrameSpec> = {
  iphone_se: {
    frameWidth: 395,
    frameHeight: 707,
    screenWidth: 375,
    screenHeight: 667,
    frameCornerRadius: 40,
    screenCornerRadius: 0, // SE has flat screen corners
    notchType: 'none',
    notchWidth: 0,
    notchHeight: 0,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    bezelWidth: 10,
  },
  iphone_14: {
    frameWidth: 410,
    frameHeight: 874,
    screenWidth: 390,
    screenHeight: 844,
    frameCornerRadius: 50,
    screenCornerRadius: 47,
    notchType: 'notch',
    notchWidth: 162,
    notchHeight: 34,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    bezelWidth: 10,
  },
  iphone_15: {
    frameWidth: 413,
    frameHeight: 882,
    screenWidth: 393,
    screenHeight: 852,
    frameCornerRadius: 55,
    screenCornerRadius: 52,
    notchType: 'dynamic_island',
    notchWidth: 126,
    notchHeight: 37,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    bezelWidth: 10,
  },
  iphone_15_pro_max: {
    frameWidth: 450,
    frameHeight: 962,
    screenWidth: 430,
    screenHeight: 932,
    frameCornerRadius: 58,
    screenCornerRadius: 55,
    notchType: 'dynamic_island',
    notchWidth: 126,
    notchHeight: 37,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    bezelWidth: 10,
  },
  iphone_16: {
    frameWidth: 413,
    frameHeight: 882,
    screenWidth: 393,
    screenHeight: 852,
    frameCornerRadius: 55,
    screenCornerRadius: 52,
    notchType: 'dynamic_island',
    notchWidth: 126,
    notchHeight: 37,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    bezelWidth: 10,
  },
  iphone_16_pro_max: {
    frameWidth: 460,
    frameHeight: 986,
    screenWidth: 440,
    screenHeight: 956,
    frameCornerRadius: 60,
    screenCornerRadius: 57,
    notchType: 'dynamic_island',
    notchWidth: 126,
    notchHeight: 37,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    bezelWidth: 10,
  },
};

export const GRID_PRESETS = [
  { label: '2×2', columns: 2, rows: 2 },
  { label: '2×3', columns: 2, rows: 3 },
  { label: '3×3', columns: 3, rows: 3 },
  { label: '3×4', columns: 3, rows: 4 },
  { label: '3×5', columns: 3, rows: 5 },
  { label: '4×6', columns: 4, rows: 6 },
];

export const MIN_GRID_COLUMNS = 1;
export const MAX_GRID_COLUMNS = 4;
export const MIN_GRID_ROWS = 1;
export const MAX_GRID_ROWS = 8;
