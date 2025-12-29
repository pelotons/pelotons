import { useState } from 'react';
import {
  WidgetCategory,
  WIDGET_CATEGORIES,
  WIDGET_DEFINITIONS,
  getWidgetsByCategory,
} from '@peloton/shared';

// Category icons
const CATEGORY_ICONS: Record<WidgetCategory, string> = {
  speed: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  power: 'M13 10V3L4 14h7v7l9-11h-7z',
  heart_rate: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  cadence: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  distance: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  time: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  elevation: 'M5 3l3.5 4.5L12 4l3.5 3.5L19 4v14H5V3z',
  navigation: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  performance: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  gears: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  environment: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  graphs: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  maps: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
};

export function WidgetReference() {
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalWidgets = Object.keys(WIDGET_DEFINITIONS).length;

  const filteredWidgets = Object.values(WIDGET_DEFINITIONS).filter((widget) => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      widget.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget Reference</h1>
      <p className="text-lg text-gray-600 mb-8">
        Browse all {totalWidgets} available data fields for your bike computer screen.
      </p>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as WidgetCategory | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {WIDGET_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label} ({getWidgetsByCategory(cat.id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Category Overview */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {WIDGET_CATEGORIES.map((category) => {
            const widgets = getWidgetsByCategory(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <svg
                      className="w-4 h-4"
                      style={{ color: category.color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={CATEGORY_ICONS[category.id]}
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{category.label}</span>
                </div>
                <p className="text-xs text-gray-500">{widgets.length} widgets</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredWidgets.length} widget{filteredWidgets.length !== 1 ? 's' : ''}
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="ml-2 text-blue-600 hover:text-blue-700"
          >
            Clear filter
          </button>
        )}
      </p>

      {/* Widget List by Category */}
      {selectedCategory === 'all' && !searchQuery ? (
        // Grouped by category
        WIDGET_CATEGORIES.map((category) => {
          const widgets = getWidgetsByCategory(category.id);
          return (
            <div key={category.id} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: category.color }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={CATEGORY_ICONS[category.id]}
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>

              <div className="grid gap-3">
                {widgets.map((widget) => (
                  <WidgetCard key={widget.type} widget={widget} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Flat list for search/filter
        <div className="grid gap-3">
          {filteredWidgets.map((widget) => (
            <WidgetCard key={widget.type} widget={widget} />
          ))}
        </div>
      )}

      {filteredWidgets.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">No widgets found matching your search.</p>
        </div>
      )}
    </div>
  );
}

function WidgetCard({ widget }: { widget: (typeof WIDGET_DEFINITIONS)[keyof typeof WIDGET_DEFINITIONS] }) {
  const category = WIDGET_CATEGORIES.find((c) => c.id === widget.category);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">{widget.label}</h3>
            {widget.unit && (
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                {widget.unit}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{widget.description}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: category?.color + '20',
                color: category?.color,
              }}
            >
              {category?.label}
            </span>
            {widget.requiresSensor && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                Requires {widget.sensorType?.replace('_', ' ')} sensor
              </span>
            )}
            {widget.requiresGPS && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Requires GPS
              </span>
            )}
            {widget.requiresRoute && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                Requires loaded route
              </span>
            )}
            {widget.supportsZones && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Zone colors
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>Size: {widget.defaultWidth}x{widget.defaultHeight}</div>
          <div className="font-mono mt-1">{widget.type}</div>
        </div>
      </div>
    </div>
  );
}
