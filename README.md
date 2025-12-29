# Peloton - Open Source Bike Computer App

A mobile bike computer app designed to replace dedicated GPS cycling computers like Garmin Edge and Wahoo ELEMNT, with a superior web-based configuration experience.

## Features

### Mobile App (React Native + Expo)

- **Map Screen**: Real-time GPS tracking with Mapbox navigation
- **Data Screen**: Configurable widget layout (heart rate, power, speed, etc.)
- **Bluetooth Sensors**: Heart rate monitors, power meters, SRAM AXS, Shimano Di2
- **Ride Recording**: GPS tracking with stats and GPX export

### Web Configurator (React + Vite)

- **Route Builder**: Click-to-create routes with Mapbox Directions API
- **Route Collections**: Organize routes into themed collections (e.g., "Weekend Rides")
- **Layout Builder**: Drag-and-drop widget configuration
- **Profile System**: Create multiple screen profiles for different riding styles

### Widget Library (95+ Widgets)

Comprehensive data fields inspired by Garmin Edge and Wahoo ELEMNT:

| Category | Examples |
|----------|----------|
| **Speed** | Current, Average, Max, Lap, 3s Average, Pace |
| **Power** | Instant, 3s/10s/30s, Normalized, IF, TSS, W/kg, Balance |
| **Heart Rate** | Current, Avg, Max, Zones, %HRmax, %HRR |
| **Elevation** | Altitude, Grade, VAM, Ascent/Descent Remaining |
| **Navigation** | Turn Distance, ETA, Distance Remaining, Off Course |
| **Performance** | Calories, Kilojoules, Training Load, Stamina |
| **Gears** | Gear Ratio, Di2/AXS Battery, Front/Rear Position |
| **Graphs** | Power, HR, Speed, Elevation trending |
| **Maps** | Full Map, Mini Map, Climb Profile |

### Default Screen Profiles

Pre-configured layouts for common use cases:

- **Road Racing** - Power-focused with NP, IF, TSS
- **Climbing** - VAM, grade, elevation metrics
- **Structured Training** - Lap metrics and zone tracking
- **Endurance** - Essential long-ride metrics
- **Navigation** - Map-focused with turn guidance
- **Indoor Training** - Smart trainer optimized
- **Mountain Bike** - Trail metrics with gear info
- **Gravel** - Balance of navigation + performance
- **Commute** - Simple everyday layout with ETA
- **Minimal** - Clean, distraction-free essentials

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web Configurator | React 18 + TypeScript + Vite + Tailwind CSS |
| Mobile App | React Native + Expo |
| Backend | Supabase (PostgreSQL, Auth, Real-time) |
| Maps | Mapbox GL JS + Mapbox Directions API |
| Bluetooth | react-native-ble-plx |
| Shared Code | TypeScript monorepo with npm workspaces |

## Project Structure

```
peloton/
├── apps/
│   ├── web/                    # React web configurator
│   │   └── src/
│   │       ├── components/     # React components
│   │       │   ├── Auth/       # Authentication
│   │       │   ├── Collections/# Route collections
│   │       │   ├── LayoutBuilder/# Widget drag-drop
│   │       │   ├── RouteBuilder/ # Map route creation
│   │       │   └── Routes/     # Route management
│   │       ├── hooks/          # Data fetching hooks
│   │       └── lib/            # Utilities (mapbox, supabase, gpx)
│   └── mobile/                 # React Native Expo app
│       └── src/
│           ├── components/     # Mobile UI components
│           └── services/       # BLE, location services
├── packages/
│   └── shared/                 # Shared types and constants
│       └── src/
│           ├── types/          # TypeScript interfaces
│           │   ├── layout.ts   # Widget and screen types
│           │   ├── route.ts    # Route and waypoint types
│           │   └── profile.ts  # Profile configuration types
│           └── constants/
│               ├── widgets.ts  # 95+ widget definitions
│               ├── devices.ts  # Device presets
│               └── bluetooth.ts# BLE service UUIDs
└── supabase/
    └── migrations/             # Database schema
```

## Getting Started

### Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/peloton.git
cd peloton
./scripts/setup.sh

# Configure environment
cp .env.example .env
# Edit .env with your Supabase and Mapbox credentials

# Start web app
npm run dev:web
```

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account (free tier available)
- Mapbox account (free tier available)
- For mobile: Expo CLI, iOS Simulator (Xcode) or Android Emulator

## Setting Up Credentials

### Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get credentials from **Settings > API**:
   - `SUPABASE_URL` - Project URL
   - `SUPABASE_PUBLISHABLE_KEY` - Publishable key (anon key)
4. Run migrations in **SQL Editor**:
   - Copy `supabase/migrations/001_initial_schema.sql`
   - Optionally run `002_add_route_coordinates.sql` for route thumbnails

### Mapbox Setup

1. Create account at [mapbox.com](https://www.mapbox.com)
2. Get **Default public token** from [Account page](https://account.mapbox.com/)
3. For mobile app, create a secret token with `downloads:read` scope

## Environment Variables

```bash
# .env file (root directory)

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mapbox
MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGFiY2RlZmcifQ...
```

## Development

### Web App

```bash
npm run dev:web        # Start dev server at localhost:5173
npm run build          # Production build
npm run typecheck      # TypeScript checking
```

### Mobile App

```bash
cd apps/mobile
npx expo start         # Start Expo dev server
npx expo run:ios       # Run on iOS simulator
npx expo run:android   # Run on Android emulator
```

### Shared Package

```bash
cd packages/shared
npm run typecheck      # Verify types
```

## Database Schema

| Table | Description |
|-------|-------------|
| `layouts` | Screen widget configurations |
| `routes` | GPX routes with waypoints and coordinates |
| `rides` | Recorded cycling activities |
| `sensors` | Paired Bluetooth sensors |
| `route_collections` | User-created route groups |
| `collection_routes` | Route-to-collection mappings |
| `data_profiles` | Screen configuration profiles |
| `profile_screens` | Individual screens within profiles |

All tables include Row Level Security (RLS) policies for user data isolation.

## Supported Sensors

| Sensor Type | BLE Service UUID | Notes |
|-------------|-----------------|-------|
| Heart Rate | 0x180D | Standard HR monitors |
| Power Meter | 0x1818 | Cycling power meters |
| Speed/Cadence | 0x1816 | Combined or separate sensors |
| SRAM AXS | Proprietary | Electronic shifting |
| Shimano Di2 | Proprietary | Electronic shifting |

## API Documentation

### Widget Types

```typescript
import { WidgetType, WIDGET_DEFINITIONS } from '@peloton/shared';

// Get widget metadata
const powerWidget = WIDGET_DEFINITIONS['power_3s'];
// { type: 'power_3s', label: '3s Power', unit: 'W', category: 'power', ... }

// Get widgets by category
import { getWidgetsByCategory } from '@peloton/shared';
const powerWidgets = getWidgetsByCategory('power');
```

### Default Layouts

```typescript
import { DEFAULT_SCREEN_LAYOUTS } from '@peloton/shared';

// Get road racing layout
const racingLayout = DEFAULT_SCREEN_LAYOUTS.find(l => l.profile === 'road_racing');
```

## Troubleshooting

### "Mapbox token not found"

Ensure `.env` contains `MAPBOX_TOKEN`. Restart dev server after changes.

### "Supabase connection failed"

1. Check project is not paused in Supabase dashboard
2. Verify URL and key are correct
3. Run database migrations

### iOS build fails with Mapbox

Update `RNMapboxMapsDownloadToken` in `apps/mobile/app.json` with your secret Mapbox token.

### Type errors in shared package

```bash
cd packages/shared && npm run typecheck
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

GPL-3.0 - See [LICENSE](LICENSE) for details.
