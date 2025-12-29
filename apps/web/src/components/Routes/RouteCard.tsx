import { Link } from 'react-router-dom';
import { Route } from '@peloton/shared';
import { RouteThumbnail } from './RouteThumbnail';

interface RouteCardProps {
  route: Route;
  onDelete: () => void;
  onAddToCollection?: () => void;
}

export function RouteCard({ route, onDelete, onAddToCollection }: RouteCardProps) {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/routes/${route.id}`} className="block">
        <div className="aspect-[4/3] bg-gray-100 relative">
          <RouteThumbnail waypoints={route.waypoints} routeCoordinates={route.routeCoordinates} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/routes/${route.id}`} className="block">
          <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600">
            {route.name}
          </h3>
        </Link>

        {route.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {route.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{formatDistance(route.distanceM)}</span>
          </div>

          {route.elevationGainM && route.elevationGainM > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{route.elevationGainM}m</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(route.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <Link
              to={`/routes/${route.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Edit route"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete route"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {onAddToCollection && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCollection();
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                title="Add to collection"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
