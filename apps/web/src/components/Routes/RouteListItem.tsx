import { Link } from 'react-router-dom';
import { Route } from '@peloton/shared';

interface RouteListItemProps {
  route: Route;
  onDelete: () => void;
  onAddToCollection?: () => void;
}

export function RouteListItem({ route, onDelete, onAddToCollection }: RouteListItemProps) {
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
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <Link to={`/routes/${route.id}`} className="block">
          <h3 className="font-medium text-gray-900 truncate hover:text-blue-600">
            {route.name}
          </h3>
          {route.description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {route.description}
            </p>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1.5 min-w-[80px]">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{formatDistance(route.distanceM)}</span>
        </div>

        {route.elevationGainM && route.elevationGainM > 0 ? (
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>{route.elevationGainM}m</span>
          </div>
        ) : (
          <div className="min-w-[70px]" />
        )}

        <div className="text-gray-400 min-w-[100px]">
          {formatDate(route.createdAt)}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link
          to={`/routes/${route.id}`}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          title="Edit route"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Delete route"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        {onAddToCollection && (
          <button
            onClick={onAddToCollection}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
            title="Add to collection"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
