import { Link } from 'react-router-dom';

export function DocsGettingStarted() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Getting Started</h1>

      <p className="lead text-xl text-gray-600">
        Get up and running with Peloton in minutes. This guide walks you through account setup,
        sensor pairing, and creating your first ride profile.
      </p>

      <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Before you begin</h4>
            <p className="text-blue-700 text-sm">
              You'll need a smartphone (iOS 14+ or Android 8.0+) with Bluetooth LE support.
              Compatible sensors are optional but recommended for full functionality.
            </p>
          </div>
        </div>
      </div>

      <h2>Step 1: Create Your Account</h2>

      <ol>
        <li>
          <Link to="/auth" className="text-blue-600 hover:text-blue-700">Click here to create a free account</Link> or
          tap "Sign Up" on the homepage
        </li>
        <li>Enter your email address and create a secure password</li>
        <li>Verify your email address by clicking the link sent to your inbox</li>
        <li>You're now logged in and ready to configure your bike computer</li>
      </ol>

      <h2>Step 2: Install the Mobile App</h2>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">iOS App</h4>
              <p className="text-sm text-gray-500">iPhone 8 or newer</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Download from the App Store. Requires iOS 14.0 or later.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 2.277a1.333 1.333 0 0 0-.46-.054L7.06 3.157c-.752.055-1.35.632-1.425 1.382L4.99 11.5H3.5a1.5 1.5 0 0 0 0 3h1.063l.353 3.895a1.444 1.444 0 0 0 1.425 1.328l.195-.003 9.996-.935a1.333 1.333 0 0 0 1.218-1.193l1.236-13.6a1.333 1.333 0 0 0-.463-1.115zM12 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Android App</h4>
              <p className="text-sm text-gray-500">Android 8.0+</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Download from Google Play Store. Requires Bluetooth LE support.
          </p>
        </div>
      </div>

      <h2>Step 3: Connect Your Sensors</h2>

      <p>
        Peloton supports a wide range of Bluetooth LE sensors. Here's how to pair them:
      </p>

      <ol>
        <li>Open the mobile app and go to <strong>Settings → Sensors</strong></li>
        <li>Tap <strong>Scan for Sensors</strong></li>
        <li>Wake up your sensor (put on your HR strap, spin your crank, etc.)</li>
        <li>Select your sensor from the list when it appears</li>
        <li>The sensor will be saved and auto-connect on future rides</li>
      </ol>

      <h3>Supported Sensor Types</h3>

      <div className="not-prose overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sensor Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Provided</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Examples</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Heart Rate Monitor</td>
              <td className="px-4 py-3 text-sm text-gray-600">BPM, zones, %max</td>
              <td className="px-4 py-3 text-sm text-gray-600">Garmin HRM-Pro, Wahoo TICKR, Polar H10</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Power Meter</td>
              <td className="px-4 py-3 text-sm text-gray-600">Watts, cadence, balance</td>
              <td className="px-4 py-3 text-sm text-gray-600">Favero Assioma, Garmin Rally, Stages</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Speed Sensor</td>
              <td className="px-4 py-3 text-sm text-gray-600">Speed, distance</td>
              <td className="px-4 py-3 text-sm text-gray-600">Garmin Speed 2, Wahoo SPEED</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Cadence Sensor</td>
              <td className="px-4 py-3 text-sm text-gray-600">RPM</td>
              <td className="px-4 py-3 text-sm text-gray-600">Wahoo CADENCE, Garmin Cadence 2</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">Electronic Shifting</td>
              <td className="px-4 py-3 text-sm text-gray-600">Gear position, battery</td>
              <td className="px-4 py-3 text-sm text-gray-600">SRAM AXS, Shimano Di2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Step 4: Create Your First Profile</h2>

      <p>
        Profiles define what data you see on your bike computer screen. Peloton comes with
        pre-configured profiles, or you can create your own.
      </p>

      <h3>Using a Default Profile</h3>

      <ol>
        <li>Log in to the web configurator</li>
        <li>Go to <strong>Profiles</strong></li>
        <li>Browse the default profiles (Road Racing, Climbing, Endurance, etc.)</li>
        <li>Click <strong>Activate</strong> on your preferred profile</li>
        <li>The profile will sync to your mobile app automatically</li>
      </ol>

      <h3>Creating a Custom Profile</h3>

      <ol>
        <li>Go to <strong>Profiles → Create New</strong></li>
        <li>Choose your device type (determines screen dimensions)</li>
        <li>Add screens to your profile (data screens, map screens)</li>
        <li>Drag widgets from the library onto your screen</li>
        <li>Resize and arrange widgets to your preference</li>
        <li>Save and activate your profile</li>
      </ol>

      <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Pro Tip</h4>
            <p className="text-green-700 text-sm">
              Start with a default profile that matches your riding style, then customize
              it to add or remove specific widgets. This is faster than building from scratch.
            </p>
          </div>
        </div>
      </div>

      <h2>Step 5: Create a Route (Optional)</h2>

      <p>
        If you want turn-by-turn navigation, create a route using the Route Builder:
      </p>

      <ol>
        <li>Go to <strong>Routes → Create Route</strong></li>
        <li>Search for a starting location or click on the map</li>
        <li>Click to add waypoints along your desired path</li>
        <li>The route will auto-calculate using cycling-friendly roads</li>
        <li>Save your route with a descriptive name</li>
        <li>Access it from the mobile app during your ride</li>
      </ol>

      <h2>Step 6: Start Riding!</h2>

      <ol>
        <li>Mount your phone on your handlebars</li>
        <li>Open the Peloton app</li>
        <li>Your sensors will auto-connect</li>
        <li>Tap <strong>Start Ride</strong></li>
        <li>Swipe between screens during your ride</li>
        <li>Tap <strong>End Ride</strong> when finished</li>
      </ol>

      <div className="not-prose mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/docs/features"
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Explore Features</div>
              <div className="text-sm text-gray-500">Learn about all capabilities</div>
            </div>
          </Link>
          <Link
            to="/docs/widgets"
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Widget Reference</div>
              <div className="text-sm text-gray-500">Browse 95+ data fields</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
