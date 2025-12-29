import React from 'react';
import { WidgetType, WIDGET_DEFINITIONS } from '@peloton/shared';

interface WidgetLibraryProps {
  onAddWidget: (type: WidgetType) => void;
}

const WIDGET_ICONS: Record<WidgetType, string> = {
  heart_rate: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  power: 'M13 10V3L4 14h7v7l9-11h-7z',
  speed: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  cadence: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  time: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  distance: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  elevation: 'M5 3l3.5 4.5L12 4l3.5 3.5L19 4v14H5V3z',
  gear: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  map_mini: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
};

export function WidgetLibrary({ onAddWidget }: WidgetLibraryProps) {
  const widgetTypes = Object.keys(WIDGET_DEFINITIONS) as WidgetType[];

  return (
    <div className="space-y-2">
      {widgetTypes.map((type) => {
        const definition = WIDGET_DEFINITIONS[type];
        return (
          <button
            key={type}
            onClick={() => onAddWidget(type)}
            className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={WIDGET_ICONS[type]}
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {definition.label}
              </div>
              {definition.unit && (
                <div className="text-xs text-gray-500">{definition.unit}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
