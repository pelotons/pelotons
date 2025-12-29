import { LocationTracker, LocationPoint, calculateDistance } from '../location/LocationTracker';
import { RideStats, RideDataPoint } from '@peloton/shared';

export interface RideRecorderOptions {
  movingThreshold?: number; // Speed in m/s to count as moving
}

export class RideRecorder {
  private locationTracker: LocationTracker;
  private startTime: number | null = null;
  private pauseTime: number | null = null;
  private totalPausedTime: number = 0;
  private lastPoint: LocationPoint | null = null;
  private stats: RideStats;
  private dataPoints: RideDataPoint[] = [];
  private isRecording = false;
  private isPaused = false;
  private movingThreshold: number;

  // Sensor data (updated externally)
  private currentHeartRate: number = 0;
  private currentPower: number = 0;
  private currentCadence: number = 0;

  // Aggregates for averages
  private heartRateSum: number = 0;
  private heartRateCount: number = 0;
  private maxHeartRate: number = 0;
  private powerSum: number = 0;
  private powerCount: number = 0;
  private maxPower: number = 0;

  constructor(options?: RideRecorderOptions) {
    this.locationTracker = new LocationTracker();
    this.movingThreshold = options?.movingThreshold ?? 1.0; // Default 1 m/s (~3.6 km/h)
    this.stats = this.createInitialStats();
  }

  private createInitialStats(): RideStats {
    return {
      distanceM: 0,
      elapsedTimeS: 0,
      movingTimeS: 0,
      avgSpeedMs: 0,
      maxSpeedMs: 0,
      elevationGainM: 0,
      currentSpeedMs: 0,
    };
  }

  async start(onUpdate: (stats: RideStats) => void): Promise<void> {
    this.stats = this.createInitialStats();
    this.dataPoints = [];
    this.startTime = Date.now();
    this.pauseTime = null;
    this.totalPausedTime = 0;
    this.lastPoint = null;
    this.isRecording = true;
    this.isPaused = false;

    // Reset aggregates
    this.heartRateSum = 0;
    this.heartRateCount = 0;
    this.maxHeartRate = 0;
    this.powerSum = 0;
    this.powerCount = 0;
    this.maxPower = 0;

    await this.locationTracker.start((point) => {
      this.processPoint(point);
      onUpdate({ ...this.stats });
    });
  }

  private processPoint(point: LocationPoint): void {
    const speed = point.speed ?? 0;
    this.stats.currentSpeedMs = Math.max(0, speed);

    // Track max speed
    if (speed > this.stats.maxSpeedMs) {
      this.stats.maxSpeedMs = speed;
    }

    if (this.lastPoint) {
      // Calculate distance
      const distance = calculateDistance(
        this.lastPoint.latitude,
        this.lastPoint.longitude,
        point.latitude,
        point.longitude
      );
      this.stats.distanceM += distance;

      // Calculate time intervals
      const timeDiff = (point.timestamp - this.lastPoint.timestamp) / 1000;

      // Add to moving time if above threshold
      if (speed > this.movingThreshold) {
        this.stats.movingTimeS += timeDiff;
      }

      // Calculate elevation gain
      if (point.altitude !== null && this.lastPoint.altitude !== null) {
        const elevDiff = point.altitude - this.lastPoint.altitude;
        if (elevDiff > 0) {
          this.stats.elevationGainM += elevDiff;
        }
      }
    }

    // Update elapsed time
    if (this.startTime) {
      const now = Date.now();
      this.stats.elapsedTimeS = (now - this.startTime - this.totalPausedTime) / 1000;
    }

    // Calculate average speed (based on moving time)
    if (this.stats.movingTimeS > 0) {
      this.stats.avgSpeedMs = this.stats.distanceM / this.stats.movingTimeS;
    }

    // Store data point with sensor data
    this.dataPoints.push({
      timestamp: point.timestamp,
      latitude: point.latitude,
      longitude: point.longitude,
      altitude: point.altitude ?? undefined,
      speed: speed,
      heartRate: this.currentHeartRate > 0 ? this.currentHeartRate : undefined,
      power: this.currentPower > 0 ? this.currentPower : undefined,
      cadence: this.currentCadence > 0 ? this.currentCadence : undefined,
    });

    this.lastPoint = point;
  }

  pause(): void {
    if (!this.isRecording || this.isPaused) return;

    this.isPaused = true;
    this.pauseTime = Date.now();
    this.locationTracker.pause();
  }

  async resume(onUpdate: (stats: RideStats) => void): Promise<void> {
    if (!this.isRecording || !this.isPaused) return;

    if (this.pauseTime) {
      this.totalPausedTime += Date.now() - this.pauseTime;
    }

    this.isPaused = false;
    this.pauseTime = null;

    await this.locationTracker.resume((point) => {
      this.processPoint(point);
      onUpdate({ ...this.stats });
    });
  }

  stop(): {
    stats: RideStats;
    dataPoints: RideDataPoint[];
    startedAt: string;
    endedAt: string;
    avgHeartRate?: number;
    maxHeartRate?: number;
    avgPower?: number;
    maxPower?: number;
  } {
    this.isRecording = false;
    this.isPaused = false;
    this.locationTracker.stop();

    const endedAt = new Date().toISOString();
    const startedAt = this.startTime
      ? new Date(this.startTime).toISOString()
      : endedAt;

    const result: ReturnType<RideRecorder['stop']> = {
      stats: { ...this.stats },
      dataPoints: [...this.dataPoints],
      startedAt,
      endedAt,
    };

    // Add sensor averages if we have data
    if (this.heartRateCount > 0) {
      result.avgHeartRate = Math.round(this.heartRateSum / this.heartRateCount);
      result.maxHeartRate = this.maxHeartRate;
    }
    if (this.powerCount > 0) {
      result.avgPower = Math.round(this.powerSum / this.powerCount);
      result.maxPower = this.maxPower;
    }

    return result;
  }

  // Call these to update sensor readings
  updateHeartRate(hr: number): void {
    this.currentHeartRate = hr;
    if (hr > 0) {
      this.heartRateSum += hr;
      this.heartRateCount++;
      if (hr > this.maxHeartRate) {
        this.maxHeartRate = hr;
      }
    }
  }

  updatePower(power: number, cadence?: number): void {
    this.currentPower = power;
    if (cadence !== undefined) {
      this.currentCadence = cadence;
    }
    if (power > 0) {
      this.powerSum += power;
      this.powerCount++;
      if (power > this.maxPower) {
        this.maxPower = power;
      }
    }
  }

  getStats(): RideStats {
    return { ...this.stats };
  }

  getDataPoints(): RideDataPoint[] {
    return [...this.dataPoints];
  }

  isRunning(): boolean {
    return this.isRecording && !this.isPaused;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
}
