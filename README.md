# Peloton - Open Source Bike Computer App

A mobile bike computer app designed to replace dedicated GPS cycling computers like Garmin Edge and Wahoo ELEMNT, with a superior web-based configuration experience.

## Features

### Mobile App (React Native + Expo)

- **Map Screen**: Real-time GPS tracking with Mapbox navigation
- **Data Screen**: Configurable widget layout (heart rate, power, speed, etc.)
- **Bluetooth Sensors**: Heart rate monitors, power meters, SRAM AXS
- **Ride Recording**: GPS tracking with stats and GPX export

### Web Configurator (React + Vite)

- **Route Builder**: Click-to-create routes with Mapbox Directions API
- **Layout Builder**: Drag-and-drop widget configuration with Konva

## Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Web Configurator | React + TypeScript + Vite + Tailwind   |
| Drag-and-drop    | Konva + react-konva                    |
| Mobile App       | React Native + Expo                    |
| Backend          | Supabase (PostgreSQL, Auth, Storage)   |
| Maps             | Mapbox                                 |
| Bluetooth        | react-native-ble-plx                   |

## Project Structure

```text
/peloton
├── apps/
│   ├── web/          # React web configurator
│   └── mobile/       # React Native Expo app
├── packages/
│   └── shared/       # Shared types and constants
└── supabase/
    └── migrations/   # Database schema
```

## Getting Started

### Quick Start

Run the setup script to check prerequisites and install dependencies:

```bash
./scripts/setup.sh
```

### Prerequisites

- Node.js 18+
- npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Xcode) for iOS development
- Supabase account (free tier available)
- Mapbox account (free tier available)

---

## Setting Up Credentials

### Supabase Setup

1. **Create a Supabase account** at [https://supabase.com](https://supabase.com)

2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter a project name (e.g., "peloton")
   - Set a database password (save this!)
   - Select a region close to you
   - Click "Create new project"

3. **Get your API credentials**:
   - Go to **Settings** (gear icon in sidebar)
   - Click **API** in the left menu
   - Copy these values:

   | Setting | Where to find it |
   | ------- | ---------------- |
   | `VITE_SUPABASE_URL` | Project URL (e.g., `https://abc123.supabase.co`) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key (starts with `eyJ...`) under "Project API keys" |

4. **Run the database migration**:
   - Go to **SQL Editor** in the Supabase dashboard
   - Click "New query"
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

5. **Enable Email Auth** (already enabled by default):
   - Go to **Authentication** > **Providers**
   - Ensure "Email" is enabled

### Mapbox Setup

1. **Create a Mapbox account** at [https://www.mapbox.com](https://www.mapbox.com)

2. **Get your access token**:
   - Sign in and go to your [Account page](https://account.mapbox.com/)
   - Scroll down to "Access tokens"
   - Copy your **Default public token** (starts with `pk.`)
   - This is your `VITE_MAPBOX_TOKEN`

3. **For mobile app (optional but recommended)**:
   - Click "Create a token"
   - Name it "Peloton Mobile"
   - Enable these scopes:
     - `styles:read`
     - `fonts:read`
     - `datasets:read`
     - `vision:read`
   - Under "Secret scopes", enable:
     - `downloads:read` (required for Mapbox SDK downloads)
   - Copy this secret token for `RNMapboxMapsDownloadToken` in `apps/mobile/app.json`

---

## Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials (both web and mobile read from this single file):

```bash
# Supabase - from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx

# Mapbox - from https://account.mapbox.com/
MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

---

## Run Development Servers

**Web Configurator:**

```bash
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173)

**Mobile App:**

```bash
cd apps/mobile
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## Database Schema

- `layouts` - Screen widget configurations
- `routes` - GPX routes created in web app
- `rides` - Recorded cycling activities
- `sensors` - Paired Bluetooth sensors

All tables include Row Level Security (RLS) policies.

## Supported Sensors

| Sensor Type   | BLE Service  |
| ------------- | ------------ |
| Heart Rate    | 0x180D       |
| Power Meter   | 0x1818       |
| Speed/Cadence | 0x1816       |
| SRAM AXS      | Proprietary  |

## Development

### Web App

```bash
cd apps/web
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # Type checking
```

### Mobile App

```bash
cd apps/mobile
npx expo start         # Start Expo
npx expo run:ios       # iOS simulator
npx expo run:android   # Android emulator
```

## Troubleshooting

### "Mapbox token not found"

Ensure your `.env` file exists and contains `VITE_MAPBOX_TOKEN`. Restart the dev server after changes.

### "Supabase connection failed"

1. Check that your Supabase project is active (not paused)
2. Verify the URL and anon key are correct
3. Ensure you ran the database migration

### iOS build fails with Mapbox

Update the `RNMapboxMapsDownloadToken` in `apps/mobile/app.json` with your secret Mapbox token.

## License

MIT
