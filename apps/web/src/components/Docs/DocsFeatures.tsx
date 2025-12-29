import { Link } from 'react-router-dom';

export function DocsFeatures() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Features</h1>

      <p className="lead text-xl text-gray-600">
        Peloton combines the best features from dedicated bike computers with the convenience
        of your smartphone and the power of web-based configuration.
      </p>

      {/* Route Builder */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Route Builder</h2>
            <p className="text-gray-600">
              Create routes by clicking on a map or searching for locations. Routes automatically
              follow cycling-friendly roads and paths.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Key Capabilities</h4>
          <ul className="grid md:grid-cols-2 gap-3">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Click-to-create waypoints on interactive map</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Automatic cycling-optimized routing</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Elevation profile visualization</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">GPX import and export</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Location search with autocomplete</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">Drag waypoints to adjust route</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Route Collections */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Route Collections</h2>
            <p className="text-gray-600">
              Organize your routes into themed collections for easy access. Perfect for planning
              multi-day trips or grouping favorite local rides.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Use Cases</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-1">Weekend Rides</h5>
              <p className="text-sm text-gray-600">Group your favorite Saturday morning loops</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-1">Bike Tour</h5>
              <p className="text-sm text-gray-600">Plan multi-day adventures with daily routes</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-1">Training Routes</h5>
              <p className="text-sm text-gray-600">Organize interval and hill repeat courses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Layout Builder */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Layout Builder</h2>
            <p className="text-gray-600">
              Design your perfect bike computer screen with drag-and-drop simplicity.
              Choose from 95+ data fields organized by category.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">How It Works</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
              <p className="text-sm text-gray-700">Choose your device type</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
              <p className="text-sm text-gray-700">Browse widget categories</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
              <p className="text-sm text-gray-700">Drag widgets to screen</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
              <p className="text-sm text-gray-700">Resize and arrange</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile System */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile System</h2>
            <p className="text-gray-600">
              Create multiple profiles for different riding styles. Switch between Road Racing,
              Climbing, Training, or any custom profile instantly.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Default Profiles</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: 'Road Racing', desc: 'Power-focused with NP, IF, TSS metrics' },
              { name: 'Climbing', desc: 'VAM, grade, elevation gain emphasis' },
              { name: 'Structured Training', desc: 'Lap metrics and zone tracking' },
              { name: 'Endurance', desc: 'Essential long-ride metrics' },
              { name: 'Navigation', desc: 'Map-focused with turn guidance' },
              { name: 'Indoor Training', desc: 'Smart trainer optimized' },
              { name: 'Mountain Bike', desc: 'Trail metrics with gear info' },
              { name: 'Gravel', desc: 'Balance of navigation + performance' },
              { name: 'Commute', desc: 'Simple everyday layout with ETA' },
              { name: 'Minimal', desc: 'Clean, distraction-free essentials' },
            ].map((profile) => (
              <div key={profile.name} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium text-gray-900">{profile.name}</span>
                  <span className="text-gray-500 text-sm"> - {profile.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor Support */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bluetooth Sensor Support</h2>
            <p className="text-gray-600">
              Connect to any standard Bluetooth LE cycling sensor. Peloton supports heart rate,
              power, speed, cadence, and electronic shifting.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Standard BLE Sensors</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Heart Rate Monitors (0x180D)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Cycling Power Meters (0x1818)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Speed/Cadence Sensors (0x1816)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Electronic Shifting</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  SRAM AXS (Eagle, Red, Force, Rival)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  Shimano Di2 (Dura-Ace, Ultegra, GRX)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Library */}
      <section className="not-prose my-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">95+ Data Widgets</h2>
            <p className="text-gray-600">
              Comprehensive data fields inspired by Garmin Edge and Wahoo ELEMNT, organized into
              intuitive categories.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { cat: 'Speed', count: 8, color: 'bg-blue-500' },
              { cat: 'Power', count: 15, color: 'bg-yellow-500' },
              { cat: 'Heart Rate', count: 8, color: 'bg-red-500' },
              { cat: 'Cadence', count: 4, color: 'bg-cyan-500' },
              { cat: 'Distance', count: 6, color: 'bg-green-500' },
              { cat: 'Time', count: 8, color: 'bg-gray-500' },
              { cat: 'Elevation', count: 10, color: 'bg-emerald-500' },
              { cat: 'Navigation', count: 8, color: 'bg-indigo-500' },
              { cat: 'Performance', count: 8, color: 'bg-purple-500' },
              { cat: 'Gears', count: 6, color: 'bg-gray-700' },
              { cat: 'Environment', count: 4, color: 'bg-orange-500' },
              { cat: 'Graphs', count: 6, color: 'bg-pink-500' },
            ].map((item) => (
              <div key={item.cat} className="flex items-center gap-2">
                <span className={`w-3 h-3 ${item.color} rounded`}></span>
                <span className="text-sm text-gray-700">{item.cat} ({item.count})</span>
              </div>
            ))}
          </div>
          <Link
            to="/docs/widgets"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View complete widget reference
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Additional Features */}
      <h2>Additional Features</h2>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Ride Recording</h4>
          <p className="text-sm text-gray-600">
            GPS tracking with full activity export to GPX. View ride history and stats in the app.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Cloud Sync</h4>
          <p className="text-sm text-gray-600">
            Routes, profiles, and settings sync automatically between your devices.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Turn-by-Turn Navigation</h4>
          <p className="text-sm text-gray-600">
            Audio and visual cues for upcoming turns when following a route.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Training Zones</h4>
          <p className="text-sm text-gray-600">
            Configure power and heart rate zones with visual color coding on widgets.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Lap Tracking</h4>
          <p className="text-sm text-gray-600">
            Manual and auto-lap functionality with per-lap statistics.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Unit Preferences</h4>
          <p className="text-sm text-gray-600">
            Toggle between metric and imperial units for all measurements.
          </p>
        </div>
      </div>

      <div className="not-prose mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to try it out?</h3>
        <p className="text-blue-700 mb-4">
          Create your free account and start building your perfect bike computer setup.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Get Started Free
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
