export type WidgetType =
  | 'heart_rate'
  | 'power'
  | 'speed'
  | 'cadence'
  | 'time'
  | 'distance'
  | 'elevation'
  | 'gear'
  | 'map_mini';

export interface Widget {
  id: string;
  type: WidgetType;
  x: number; // Grid column (0-based)
  y: number; // Grid row (0-based)
  width: number; // Grid columns span
  height: number; // Grid rows span
  config?: {
    unit?: 'metric' | 'imperial';
    showLabel?: boolean;
    showAverage?: boolean;
  };
}

export interface Layout {
  id: string;
  userId: string;
  name: string;
  screenType: 'map' | 'data';
  widgets: Widget[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LayoutInsert {
  name: string;
  screenType: 'map' | 'data';
  widgets: Widget[];
  isActive?: boolean;
}

export interface LayoutUpdate {
  name?: string;
  widgets?: Widget[];
  isActive?: boolean;
}
