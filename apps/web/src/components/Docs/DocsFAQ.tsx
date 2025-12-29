import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Peloton?',
    answer: 'Peloton is an open-source bike computer app that transforms your smartphone into a full-featured cycling computer. It offers web-based configuration, Bluetooth sensor support, and customizable data screens similar to dedicated devices like Garmin Edge and Wahoo ELEMNT.',
  },
  {
    category: 'General',
    question: 'Is Peloton free to use?',
    answer: 'Yes! Peloton is completely free and open source under the GPL-3.0 license. There are no subscriptions, premium features, or hidden costs. The full source code is available on GitHub.',
  },
  {
    category: 'General',
    question: 'Why use my phone instead of a dedicated bike computer?',
    answer: 'Smartphones offer larger, higher-resolution screens, cellular connectivity for live tracking, regular software updates, and you likely already own one. Peloton provides the same data fields and customization as expensive dedicated devices without the additional hardware cost.',
  },
  {
    category: 'General',
    question: 'How does Peloton compare to Garmin or Wahoo?',
    answer: 'Peloton offers comparable functionality including 95+ data fields, route navigation, sensor support, and customizable screens. The key advantages are web-based configuration (no fiddly phone app), open-source development, and using hardware you already own. Trade-offs include shorter battery life and less weather resistance compared to dedicated units.',
  },

  // Account & Setup
  {
    category: 'Account & Setup',
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" on the homepage, enter your email and password, then verify your email address by clicking the link sent to your inbox. Your account is ready immediately after verification.',
  },
  {
    category: 'Account & Setup',
    question: 'Can I use Peloton without creating an account?',
    answer: 'An account is required to save routes, profiles, and ride history. Your data syncs across devices and persists between sessions. Account creation is free and takes less than a minute.',
  },
  {
    category: 'Account & Setup',
    question: 'What devices are supported?',
    answer: 'The mobile app requires iOS 14+ (iPhone 8 or newer) or Android 8.0+ with Bluetooth LE support. The web configurator works in any modern browser (Chrome, Firefox, Safari, Edge).',
  },

  // Sensors
  {
    category: 'Sensors',
    question: 'What sensors does Peloton support?',
    answer: 'Peloton supports standard Bluetooth LE sensors including heart rate monitors, power meters, speed sensors, cadence sensors, and electronic shifting systems (SRAM AXS and Shimano Di2).',
  },
  {
    category: 'Sensors',
    question: 'Does Peloton support ANT+ sensors?',
    answer: 'Currently, Peloton only supports Bluetooth LE sensors. Most modern cycling sensors support both ANT+ and Bluetooth. Check your sensor\'s specifications to confirm Bluetooth compatibility.',
  },
  {
    category: 'Sensors',
    question: 'My sensor won\'t connect. What should I do?',
    answer: 'First, ensure the sensor is awake (spin the wheel, pedal, or put on your HR strap). Check that Bluetooth is enabled on your phone and the sensor isn\'t connected to another device. Try removing and re-pairing the sensor in Settings → Sensors.',
  },
  {
    category: 'Sensors',
    question: 'Can I use multiple sensors of the same type?',
    answer: 'Yes, you can pair multiple power meters or heart rate monitors. This is useful for dual-sided power balance or backup sensors. Select your preferred primary sensor in Settings.',
  },

  // Routes & Navigation
  {
    category: 'Routes & Navigation',
    question: 'How do I create a route?',
    answer: 'Use the Route Builder in the web configurator. Click on the map to add waypoints, or search for specific locations. The route automatically follows cycling-friendly roads between your points.',
  },
  {
    category: 'Routes & Navigation',
    question: 'Can I import GPX files?',
    answer: 'Yes! In the Route Builder, click "Import GPX" to upload routes from other platforms like Strava, Komoot, or RideWithGPS. The route will be converted and saved to your account.',
  },
  {
    category: 'Routes & Navigation',
    question: 'How does navigation work during a ride?',
    answer: 'Select a route before starting your ride. The map screen shows your position on the route with turn-by-turn directions. You\'ll receive audio cues for upcoming turns (if enabled) and see distance to next turn on data widgets.',
  },
  {
    category: 'Routes & Navigation',
    question: 'What happens if I go off-route?',
    answer: 'Peloton detects when you deviate from the planned route and shows an "Off Course" indicator. It does not automatically recalculate routes, so you\'ll need to navigate back to your planned path.',
  },

  // Profiles & Layouts
  {
    category: 'Profiles & Layouts',
    question: 'What is a profile?',
    answer: 'A profile is a complete screen configuration for your bike computer. It includes one or more data screens, each with customized widget layouts. You might have different profiles for road racing, climbing, or casual rides.',
  },
  {
    category: 'Profiles & Layouts',
    question: 'How do I customize my data screens?',
    answer: 'Use the Layout Builder in the web configurator. Drag widgets from the library onto your screen, resize them as needed, and arrange to your preference. Changes sync automatically to the mobile app.',
  },
  {
    category: 'Profiles & Layouts',
    question: 'Can I have multiple screens in one profile?',
    answer: 'Yes! Profiles can contain multiple screens that you swipe between during a ride. For example, a main data screen, a map screen, and a climbing-focused screen.',
  },
  {
    category: 'Profiles & Layouts',
    question: 'How do I switch between profiles?',
    answer: 'In the mobile app, go to Settings → Profiles and tap on the profile you want to use. You can also set a default profile that loads automatically.',
  },

  // Rides & Data
  {
    category: 'Rides & Data',
    question: 'How accurate is GPS tracking?',
    answer: 'GPS accuracy depends on your smartphone\'s hardware and conditions. Modern phones typically achieve 3-5 meter accuracy in open areas. Dense urban environments or tree cover may reduce accuracy.',
  },
  {
    category: 'Rides & Data',
    question: 'Can I export my ride data?',
    answer: 'Yes! After completing a ride, you can export it as a GPX file for upload to Strava, TrainingPeaks, or any other platform that accepts GPX format.',
  },
  {
    category: 'Rides & Data',
    question: 'How is battery life affected during rides?',
    answer: 'A typical 3-hour ride uses 30-50% battery depending on screen brightness, GPS frequency, and sensor connections. We recommend starting with a full charge or using a handlebar-mounted battery pack for longer rides.',
  },
  {
    category: 'Rides & Data',
    question: 'What do the power metrics (NP, IF, TSS) mean?',
    answer: 'NP (Normalized Power) represents the physiological "cost" of variable power output. IF (Intensity Factor) is your effort relative to your FTP. TSS (Training Stress Score) quantifies overall training load. These metrics require a power meter and configured FTP.',
  },

  // Technical
  {
    category: 'Technical',
    question: 'Is my data private?',
    answer: 'Yes. Your data is stored in a secure Supabase database with Row Level Security, meaning only you can access your routes, profiles, and ride history. We don\'t share or sell user data.',
  },
  {
    category: 'Technical',
    question: 'Does Peloton work offline?',
    answer: 'Basic ride recording works offline with GPS. However, you\'ll need an internet connection for map tiles, route sync, and profile changes. We recommend downloading routes before rides in low-connectivity areas.',
  },
  {
    category: 'Technical',
    question: 'How do I report a bug or request a feature?',
    answer: 'Visit our GitHub repository and open an issue. Please include your device model, OS version, and steps to reproduce the bug. We actively review and respond to community feedback.',
  },
];

export function DocsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(FAQ_ITEMS.map((item) => item.category))];

  const filteredItems =
    selectedCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ & Support</h1>
      <p className="text-lg text-gray-600 mb-8">
        Find answers to common questions and get help with Peloton.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Questions' : category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <span className="font-medium text-gray-900">{item.question}</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-white border-t border-gray-200">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">GitHub Issues</h3>
            <p className="text-sm text-gray-600 mb-3">
              Report bugs, request features, or ask questions on our GitHub repository.
              Our community and maintainers actively monitor and respond.
            </p>
            <a
              href="https://github.com/your-org/peloton/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Open an Issue
            </a>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Community Discussions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Join the discussion with other Peloton users. Share your setups, get
              tips, and connect with the cycling community.
            </p>
            <a
              href="https://github.com/your-org/peloton/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Join Discussions
            </a>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Troubleshooting Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-medium text-blue-900">Sensor not connecting?</span>
              <span className="text-blue-700 text-sm block">Wake it up, disable Bluetooth on other devices, and try re-pairing.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-medium text-blue-900">Profile not syncing?</span>
              <span className="text-blue-700 text-sm block">Check your internet connection and pull-to-refresh in the mobile app.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-medium text-blue-900">GPS inaccurate?</span>
              <span className="text-blue-700 text-sm block">Ensure location permissions are set to "Always" and you're in an open area.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-medium text-blue-900">App crashing?</span>
              <span className="text-blue-700 text-sm block">Force close, update to the latest version, and restart your device.</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
