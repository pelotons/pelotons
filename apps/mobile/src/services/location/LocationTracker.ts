import * as Location from 'expo-location';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null; // m/s
  accuracy: number | null;
  timestamp: number;
}

export class LocationTracker {
  private subscription: Location.LocationSubscription | null = null;
  private points: LocationPoint[] = [];
  private isTracking = false;

  async requestPermissions(): Promise<boolean> {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      return false;
    }

    // Request background permissions for long rides
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    // We can work with just foreground, but background is preferred
    return foregroundStatus === 'granted';
  }

  async start(
    onLocation: (point: LocationPoint) => void,
    options?: {
      distanceInterval?: number;
      timeInterval?: number;
    }
  ): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    this.points = [];
    this.isTracking = true;

    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: options?.distanceInterval ?? 5, // Update every 5 meters
        timeInterval: options?.timeInterval ?? 1000, // Or every second
      },
      (location) => {
        const point: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        };

        this.points.push(point);
        onLocation(point);
      }
    );
  }

  stop(): LocationPoint[] {
    this.isTracking = false;

    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    const recordedPoints = [...this.points];
    this.points = [];
    return recordedPoints;
  }

  pause(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  async resume(onLocation: (point: LocationPoint) => void): Promise<void> {
    if (!this.isTracking) return;

    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      (location) => {
        const point: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        };

        this.points.push(point);
        onLocation(point);
      }
    );
  }

  getPoints(): LocationPoint[] {
    return [...this.points];
  }

  getPointCount(): number {
    return this.points.length;
  }

  isRunning(): boolean {
    return this.isTracking && this.subscription !== null;
  }

  async getCurrentLocation(): Promise<LocationPoint | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch {
      return null;
    }
  }
}

// Helper function to calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
