import {
  WidgetType,
  WidgetCategory,
  WIDGET_CATEGORIES,
  getWidgetsByCategory,
} from '@peloton/shared';
import { useState } from 'react';

interface WidgetLibraryProps {
  onAddWidget: (type: WidgetType) => void;
}

// SVG path icons for widget categories
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

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  const [expandedCategory, setExpandedCategory] = useState<WidgetCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = WIDGET_CATEGORIES.filter((category) => {
    if (!searchQuery) return true;
    const widgets = getWidgetsByCategory(category.id);
    return widgets.some(
      (w) =>
        w.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getFilteredWidgets = (categoryId: WidgetCategory) => {
    const widgets = getWidgetsByCategory(categoryId);
    if (!searchQuery) return widgets;
    return widgets.filter(
      (w) =>
        w.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Categories */}
      <div className="space-y-1">
        {filteredCategories.map((category) => {
          const widgets = getFilteredWidgets(category.id);
          const isExpanded = expandedCategory === category.id || !!searchQuery;

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category.id ? null : category.id)
                }
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
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
                        strokeWidth="2"
                        d={CATEGORY_ICONS[category.id]}
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{category.label}</div>
                    <div className="text-xs text-gray-500">{widgets.length} widgets</div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && widgets.length > 0 && (
                <div className="p-2 space-y-1 bg-white">
                  {widgets.map((widget) => (
                    <button
                      key={widget.type}
                      onClick={() => onAddWidget(widget.type)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {widget.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{widget.description}</div>
                      </div>
                      {widget.unit && (
                        <span className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {widget.unit}
                        </span>
                      )}
                      {widget.requiresSensor && (
                        <span className="flex-shrink-0 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                          Sensor
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
