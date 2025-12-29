// Standard Bluetooth GATT Service UUIDs
export const BLE_SERVICES = {
  // Heart Rate Service
  HEART_RATE: '0000180d-0000-1000-8000-00805f9b34fb',
  // Cycling Power Service
  CYCLING_POWER: '00001818-0000-1000-8000-00805f9b34fb',
  // Cycling Speed and Cadence Service
  CYCLING_SPEED_CADENCE: '00001816-0000-1000-8000-00805f9b34fb',
  // Battery Service
  BATTERY: '0000180f-0000-1000-8000-00805f9b34fb',
  // Device Information Service
  DEVICE_INFO: '0000180a-0000-1000-8000-00805f9b34fb',
} as const;

// Standard Bluetooth GATT Characteristic UUIDs
export const BLE_CHARACTERISTICS = {
  // Heart Rate Measurement
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb',
  // Heart Rate Body Sensor Location
  BODY_SENSOR_LOCATION: '00002a38-0000-1000-8000-00805f9b34fb',
  // Cycling Power Measurement
  CYCLING_POWER_MEASUREMENT: '00002a63-0000-1000-8000-00805f9b34fb',
  // Cycling Power Feature
  CYCLING_POWER_FEATURE: '00002a65-0000-1000-8000-00805f9b34fb',
  // CSC Measurement (Speed and Cadence)
  CSC_MEASUREMENT: '00002a5b-0000-1000-8000-00805f9b34fb',
  // CSC Feature
  CSC_FEATURE: '00002a5c-0000-1000-8000-00805f9b34fb',
  // Battery Level
  BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  // Manufacturer Name
  MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
} as const;

// SRAM AXS specific UUIDs (proprietary)
export const SRAM_AXS = {
  SERVICE: '00001523-dead-beef-0002-b5a2a40100fa',
  GEAR_CHARACTERISTIC: '00001524-dead-beef-0002-b5a2a40100fa',
  BATTERY_CHARACTERISTIC: '00001525-dead-beef-0002-b5a2a40100fa',
} as const;

// Service UUIDs to scan for when looking for sensors
export const SCAN_SERVICE_UUIDS = [
  BLE_SERVICES.HEART_RATE,
  BLE_SERVICES.CYCLING_POWER,
  BLE_SERVICES.CYCLING_SPEED_CADENCE,
  SRAM_AXS.SERVICE,
] as const;

// Sensor type to service mapping
export const SENSOR_SERVICE_MAP = {
  heart_rate: BLE_SERVICES.HEART_RATE,
  power: BLE_SERVICES.CYCLING_POWER,
  cadence: BLE_SERVICES.CYCLING_SPEED_CADENCE,
  speed: BLE_SERVICES.CYCLING_SPEED_CADENCE,
  sram_axs: SRAM_AXS.SERVICE,
} as const;

export type BleServiceKey = keyof typeof BLE_SERVICES;
export type BleCharacteristicKey = keyof typeof BLE_CHARACTERISTICS;
