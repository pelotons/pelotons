export type SensorType =
  | 'heart_rate'
  | 'power'
  | 'cadence'
  | 'speed'
  | 'sram_axs';

export interface Sensor {
  id: string;
  userId: string;
  name: string;
  sensorType: SensorType;
  bleId: string;
  bleName?: string;
  lastConnectedAt?: string;
  createdAt: string;
}

export interface SensorInsert {
  name: string;
  sensorType: SensorType;
  bleId: string;
  bleName?: string;
}

export interface SensorUpdate {
  name?: string;
  bleName?: string;
  lastConnectedAt?: string;
}

export interface SensorReading {
  sensorId: string;
  sensorType: SensorType;
  timestamp: number;
  value: number;
  unit: string;
}

export interface HeartRateReading {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
}

export interface PowerReading {
  instantPower: number;
  cadence?: number;
  pedalPowerBalance?: number;
}

export interface GearReading {
  frontGear: number;
  rearGear: number;
  frontGearTeeth?: number;
  rearGearTeeth?: number;
  batteryLevel?: number;
}
