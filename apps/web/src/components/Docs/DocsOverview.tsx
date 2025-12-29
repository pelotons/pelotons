import { Link } from 'react-router-dom';

export function DocsOverview() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Peloton Documentation</h1>

      <p className="lead text-xl text-gray-600">
        Peloton is an open-source bike computer app designed to replace dedicated GPS cycling
        computers like Garmin Edge and Wahoo ELEMNT, with a superior web-based configuration
        experience.
      </p>

      <div className="not-prose grid md:grid-cols-2 gap-6 my-8">
        <Link
          to="/docs/getting-started"
          className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Set up your account, connect sensors, and configure your first ride profile in minutes.
          </p>
        </Link>

        <Link
          to="/docs/features"
          className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Features</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Explore route building, layout customization, sensor support, and more.
          </p>
        </Link>

        <Link
          to="/docs/widgets"
          className="block p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Widget Reference</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Browse 95+ data fields organized by category with detailed descriptions.
          </p>
        </Link>

        <Link
          to="/docs/faq"
          className="block p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">FAQ & Support</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Find answers to common questions and get help with troubleshooting.
          </p>
        </Link>
      </div>

      <h2>Why Peloton?</h2>

      <div className="not-prose grid md:grid-cols-3 gap-6 my-6">
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Use Your Phone</h4>
          <p className="text-sm text-gray-600">No need to buy expensive dedicated hardware</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Web Configuration</h4>
          <p className="text-sm text-gray-600">Configure from your desktop, ride on your phone</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Open Source</h4>
          <p className="text-sm text-gray-600">Free forever, community-driven development</p>
        </div>
      </div>

      <h2>Supported Hardware</h2>

      <h3>Sensors</h3>
      <ul>
        <li><strong>Heart Rate Monitors</strong> - Any Bluetooth LE heart rate strap or watch</li>
        <li><strong>Power Meters</strong> - Pedal, crank, hub, or spider-based power meters</li>
        <li><strong>Speed & Cadence</strong> - Standalone or combined sensors</li>
        <li><strong>SRAM AXS</strong> - Electronic shifting with gear display</li>
        <li><strong>Shimano Di2</strong> - Electronic shifting with battery status</li>
      </ul>

      <h3>Mobile Devices</h3>
      <ul>
        <li><strong>iOS</strong> - iPhone 8 or newer (iOS 14+)</li>
        <li><strong>Android</strong> - Android 8.0+ with Bluetooth LE support</li>
      </ul>

      <div className="not-prose mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to get started?</h3>
        <p className="text-blue-700 mb-4">
          Create your free account and start configuring your bike computer today.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          Create Free Account
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
