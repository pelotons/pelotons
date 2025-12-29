import { Link } from 'react-router-dom';
import { RouteCollectionWithStats } from '@peloton/shared';

interface CollectionListItemProps {
  collection: RouteCollectionWithStats;
  onDelete: () => void;
}

export function CollectionListItem({ collection, onDelete }: CollectionListItemProps) {
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
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/collections/${collection.id}`} className="block">
          <h3 className="font-medium text-gray-900 truncate hover:text-blue-600">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {collection.description}
            </p>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1.5 min-w-[60px]">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>{collection.routeCount}</span>
        </div>

        <div className="flex items-center gap-1.5 min-w-[80px]">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{formatDistance(collection.totalDistanceM)}</span>
        </div>

        {collection.totalElevationGainM > 0 ? (
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>{collection.totalElevationGainM}m</span>
          </div>
        ) : (
          <div className="min-w-[70px]" />
        )}

        <div className="text-gray-400 min-w-[100px]">
          {formatDate(collection.createdAt)}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link
          to={`/collections/${collection.id}`}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          title="View collection"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Delete collection"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
