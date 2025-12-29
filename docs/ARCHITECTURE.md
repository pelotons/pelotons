# Architecture Overview

This document describes the high-level architecture of the Peloton bike computer application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Users                                       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────┐                       ┌───────────────────┐
│   Web Browser     │                       │   Mobile Device   │
│   (Configurator)  │                       │   (Bike Computer) │
└─────────┬─────────┘                       └─────────┬─────────┘
          │                                           │
          │  React + Vite                             │  React Native + Expo
          │  Tailwind CSS                             │  BLE Sensors
          │  Mapbox GL JS                             │  GPS Location
          │                                           │
          └───────────────┬───────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   @peloton/shared     │
              │   (TypeScript Types)  │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Supabase         │
              │  ┌─────────────────┐  │
              │  │   PostgreSQL    │  │
              │  │   (Database)    │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │   Auth          │  │
              │  │   (JWT tokens)  │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │   Real-time     │  │
              │  │   (WebSocket)   │  │
              │  └─────────────────┘  │
              └───────────────────────┘
```

## Package Structure

### `apps/web` - Web Configurator

The web application for configuring routes and layouts from a desktop browser.

```
apps/web/src/
├── components/
│   ├── Auth/               # Authentication UI
│   │   ├── AuthProvider    # React context for auth state
│   │   ├── LoginForm       # Email/password login
│   │   └── SignupForm      # User registration
│   │
│   ├── Collections/        # Route collections management
│   │   ├── CollectionsPage # List all collections
│   │   ├── CollectionDetailPage
│   │   ├── MultiRouteMap   # Display multiple routes on map
│   │   └── DraggableRouteList
│   │
│   ├── LayoutBuilder/      # Widget layout editor
│   │   ├── ProfileBuilder  # Profile + screen management
│   │   ├── ScreenEditor    # Single screen editor
│   │   ├── WidgetLibrary   # Widget selection sidebar
│   │   └── WidgetCanvas    # Drag-drop canvas
│   │
│   ├── RouteBuilder/       # Route creation
│   │   ├── RouteBuilder    # Main route editor
│   │   ├── MapView         # Mapbox map component
│   │   ├── ElevationProfile# Elevation chart
│   │   └── LocationSearch  # Place search
│   │
│   └── Routes/             # Route listing and detail
│       ├── RoutesPage      # Grid of saved routes
│       └── RouteDetailPage # Single route view
│
├── hooks/                  # Data fetching hooks
│   ├── useRoutes.ts        # CRUD for routes
│   ├── useCollections.ts   # CRUD for collections
│   ├── useLayouts.ts       # CRUD for layouts
│   └── useProfiles.ts      # CRUD for profiles
│
└── lib/                    # Utility libraries
    ├── supabase.ts         # Database client + types
    ├── mapbox.ts           # Map APIs (directions, geocoding)
    └── gpx.ts              # GPX parsing/generation
```

### `apps/mobile` - Mobile Bike Computer

The React Native app that runs on iOS/Android during rides.

```
apps/mobile/src/
├── components/
│   ├── DataScreen/         # Widget display during ride
│   ├── MapScreen/          # Navigation map view
│   └── RideRecording/      # Activity recording UI
│
└── services/
    ├── ble/
    │   ├── BLEManager      # Bluetooth connection management
    │   ├── HeartRateService
    │   ├── PowerService
    │   └── SRAMAxsService
    │
    └── location/
        └── LocationService # GPS tracking
```

### `packages/shared` - Shared Types

TypeScript types and constants shared between web and mobile.

```
packages/shared/src/
├── types/
│   ├── layout.ts           # Widget, Layout, ScreenType
│   ├── route.ts            # Route, Waypoint, RouteCoordinate
│   ├── profile.ts          # DataProfile, ProfileScreen
│   ├── collection.ts       # RouteCollection
│   ├── ride.ts             # Ride activity data
│   └── sensor.ts           # Sensor configurations
│
└── constants/
    ├── widgets.ts          # WIDGET_DEFINITIONS (95+ widgets)
    ├── devices.ts          # DEVICE_PRESETS (screen sizes)
    └── bluetooth.ts        # BLE service UUIDs
```

## Data Flow

### 1. Route Creation (Web)

```
User clicks map → MapView captures coordinates
    ↓
RouteBuilder calls Mapbox Directions API
    ↓
Route with geometry returned
    ↓
useRoutes.createRoute() → Supabase INSERT
    ↓
Route saved with waypoints + GPX data
```

### 2. Layout Configuration (Web)

```
User drags widget → WidgetLibrary onAddWidget()
    ↓
Widget added to screen grid
    ↓
User saves profile → useProfiles.createProfile()
    ↓
Profile + screens saved to Supabase
```

### 3. Ride Recording (Mobile)

```
User starts ride → LocationService begins GPS tracking
    ↓
BLEManager connects to sensors
    ↓
Sensor data streams to DataScreen widgets
    ↓
Ride ends → Data saved locally + synced to Supabase
```

### 4. Data Synchronization

```
Mobile fetches active profile from Supabase
    ↓
Layout rendered on device screen
    ↓
Routes available for navigation
    ↓
Completed rides sync back to Supabase
```

## Database Schema

```sql
-- User data isolation via Row Level Security (RLS)

layouts              -- Widget layouts for screens
├── id               UUID PRIMARY KEY
├── user_id          UUID REFERENCES auth.users
├── name             TEXT
├── screen_type      TEXT ('data' | 'map')
├── widgets          JSONB (Widget[])
└── is_active        BOOLEAN

routes               -- GPX routes with waypoints
├── id               UUID PRIMARY KEY
├── user_id          UUID REFERENCES auth.users
├── name             TEXT
├── distance_m       INTEGER
├── elevation_gain_m INTEGER
├── gpx_data         TEXT
├── waypoints        JSONB (Waypoint[])
└── route_coordinates JSONB ([lng, lat][])

data_profiles        -- Screen configuration profiles
├── id               UUID PRIMARY KEY
├── user_id          UUID REFERENCES auth.users
├── name             TEXT
├── device_type      TEXT (references DEVICE_PRESETS)
└── is_active        BOOLEAN

profile_screens      -- Individual screens in a profile
├── id               UUID PRIMARY KEY
├── profile_id       UUID REFERENCES data_profiles
├── name             TEXT
├── screen_type      TEXT ('data' | 'map')
├── position         INTEGER (order in scroll)
├── grid_columns     INTEGER
├── grid_rows        INTEGER
└── widgets          JSONB (Widget[])

route_collections    -- Route groupings
├── id               UUID PRIMARY KEY
├── user_id          UUID REFERENCES auth.users
├── name             TEXT
└── description      TEXT

collection_routes    -- Many-to-many junction
├── collection_id    UUID REFERENCES route_collections
├── route_id         UUID REFERENCES routes
└── position         INTEGER (order in collection)
```

## Widget System

### Widget Definition Structure

```typescript
interface WidgetDefinition {
  type: WidgetType;           // Unique identifier
  label: string;              // Display name
  shortLabel: string;         // Abbreviated name
  description: string;        // Help text
  category: WidgetCategory;   // Grouping category
  unit: string;               // e.g., 'km/h', 'W', 'bpm'
  unitImperial?: string;      // Imperial unit alternative
  minWidth: number;           // Minimum grid columns
  minHeight: number;          // Minimum grid rows
  defaultWidth: number;       // Default grid columns
  defaultHeight: number;      // Default grid rows
  requiresSensor?: boolean;   // Needs BLE sensor
  sensorType?: string;        // Which sensor type
  requiresGPS?: boolean;      // Needs GPS location
  requiresRoute?: boolean;    // Needs loaded route
  supportsZones?: boolean;    // Can show training zones
  supportsGraph?: boolean;    // Can render as graph
  icon: string;               // Icon identifier
}
```

### Widget Categories

| Category | Description |
|----------|-------------|
| `speed` | Speed and pace metrics |
| `power` | Power output and zones |
| `heart_rate` | HR and cardiovascular |
| `cadence` | Pedaling metrics |
| `distance` | Distance traveled/remaining |
| `time` | Elapsed, lap, clock times |
| `elevation` | Altitude and climbing |
| `navigation` | Turn-by-turn guidance |
| `performance` | TSS, calories, training load |
| `gears` | Electronic shifting |
| `environment` | Temperature, battery |
| `graphs` | Time-series visualizations |
| `maps` | Map and route displays |

## Authentication Flow

```
1. User enters email/password
   ↓
2. Supabase Auth validates credentials
   ↓
3. JWT token returned to client
   ↓
4. Token stored in localStorage (web) or SecureStore (mobile)
   ↓
5. All Supabase queries include token
   ↓
6. RLS policies enforce user data isolation
```

## Bluetooth Sensor Protocol

### Connection Flow

```
1. BLEManager scans for devices
   ↓
2. Filter by known service UUIDs (0x180D, 0x1818, etc.)
   ↓
3. User selects device to pair
   ↓
4. Connect and discover characteristics
   ↓
5. Subscribe to notifications
   ↓
6. Parse incoming data per service specification
   ↓
7. Update React state → re-render widgets
```

### Supported Services

| Service | UUID | Data Format |
|---------|------|-------------|
| Heart Rate | 0x180D | Flags + HR value (8 or 16 bit) |
| Cycling Power | 0x1818 | Power (16-bit signed watts) |
| Speed/Cadence | 0x1816 | Cumulative revolutions + time |

## Performance Considerations

### Web App

- **Code splitting**: Lazy load routes for faster initial load
- **Map optimization**: Cluster markers, simplify geometries
- **Debounced search**: Rate limit geocoding API calls

### Mobile App

- **Sensor throttling**: Limit UI updates to 1Hz for power savings
- **Background location**: Use significant location changes when inactive
- **Offline support**: Cache routes and layouts locally

## Security

- **Row Level Security**: All database tables protected by RLS
- **JWT tokens**: Short-lived tokens with refresh mechanism
- **HTTPS only**: All API communication encrypted
- **No secrets in client**: API keys are public tokens only
