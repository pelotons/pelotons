export type WaypointType = 'start' | 'end' | 'via' | 'poi';

export interface Waypoint {
  lat: number;
  lng: number;
  name?: string;
  type?: WaypointType;
}

export interface Route {
  id: string;
  userId: string;
  name: string;
  description?: string;
  distanceM: number;
  elevationGainM?: number;
  gpxData: string;
  waypoints: Waypoint[];
  routeCoordinates?: [number, number][]; // [lng, lat] pairs
  createdAt: string;
  updatedAt: string;
}

export interface RouteInsert {
  name: string;
  description?: string;
  distanceM: number;
  elevationGainM?: number;
  gpxData: string;
  waypoints: Waypoint[];
  routeCoordinates?: [number, number][]; // [lng, lat] pairs
}

export interface RouteUpdate {
  name?: string;
  description?: string;
  distanceM?: number;
  elevationGainM?: number;
  gpxData?: string;
  waypoints?: Waypoint[];
  routeCoordinates?: [number, number][];
}

export interface RouteCoordinate {
  lat: number;
  lng: number;
  ele?: number;
}
