export interface Ride {
  id: string;
  userId: string;
  routeId?: string;
  name?: string;
  startedAt: string;
  endedAt?: string;
  distanceM: number;
  elapsedTimeS: number;
  movingTimeS: number;
  avgSpeedMs?: number;
  maxSpeedMs?: number;
  avgPower?: number;
  maxPower?: number;
  avgHr?: number;
  maxHr?: number;
  elevationGainM?: number;
  gpxPath?: string;
  createdAt: string;
}

export interface RideInsert {
  routeId?: string;
  name?: string;
  startedAt: string;
  endedAt?: string;
  distanceM: number;
  elapsedTimeS: number;
  movingTimeS: number;
  avgSpeedMs?: number;
  maxSpeedMs?: number;
  avgPower?: number;
  maxPower?: number;
  avgHr?: number;
  maxHr?: number;
  elevationGainM?: number;
  gpxPath?: string;
}

export interface RideStats {
  distanceM: number;
  elapsedTimeS: number;
  movingTimeS: number;
  avgSpeedMs: number;
  maxSpeedMs: number;
  elevationGainM: number;
  currentSpeedMs: number;
}

export interface RideDataPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  heartRate?: number;
  power?: number;
  cadence?: number;
}
