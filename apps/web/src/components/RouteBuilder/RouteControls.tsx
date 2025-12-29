import { Fragment } from 'react';
import { Waypoint } from '@peloton/shared';
import { formatDistance } from '@/lib/gpx';

interface RouteControlsProps {
  name: string;
  description: string;
  distance: number; // Total distance (used by parent for display)
  waypoints: Waypoint[];
  segmentDistances?: number[];
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onWaypointRemove: (index: number) => void;
  onClear: () => void;
}

export function RouteControls({
  name,
  description,
  distance: _distance, // Available for future use
  waypoints,
  segmentDistances = [],
  onNameChange,
  onDescriptionChange,
  onWaypointRemove,
  onClear,
}: RouteControlsProps) {
  // Calculate cumulative distance to each waypoint
  const cumulativeDistances = segmentDistances.reduce<number[]>((acc, dist, index) => {
    const prevDist = index === 0 ? 0 : acc[index - 1];
    acc.push(prevDist + dist);
    return acc;
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Route Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="My Ride"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Optional description..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Waypoints ({waypoints.length})
          </label>
          {waypoints.length > 0 && (
            <button
              onClick={onClear}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>

        {waypoints.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Click on the map to add waypoints
          </p>
        ) : (
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {waypoints.map((waypoint, index) => (
              <Fragment key={index}>
                <li className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0
                          ? 'bg-green-500'
                          : index === waypoints.length - 1
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {index === 0 ? 'S' : index === waypoints.length - 1 ? 'E' : index}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                      </span>
                      {index > 0 && cumulativeDistances[index - 1] !== undefined && (
                        <span className="text-xs text-gray-400">
                          {formatDistance(cumulativeDistances[index - 1])} from start
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onWaypointRemove(index)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove waypoint"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>

                {/* Show segment distance between waypoints */}
                {index < waypoints.length - 1 && segmentDistances[index] !== undefined && (
                  <li className="flex items-center justify-center py-1">
                    <div className="flex items-center text-xs text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {formatDistance(segmentDistances[index])}
                    </div>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        )}
      </div>

      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          <strong>Tip:</strong> Click map to add waypoints. Drag markers to adjust.
          Right-click a waypoint for more options.
        </p>
      </div>
    </div>
  );
}
