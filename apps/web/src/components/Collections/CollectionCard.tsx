import { Link } from 'react-router-dom';
import { RouteCollectionWithStats } from '@peloton/shared';

interface CollectionCardProps {
  collection: RouteCollectionWithStats;
  onDelete: () => void;
}

export function CollectionCard({ collection, onDelete }: CollectionCardProps) {
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
      <Link to={`/collections/${collection.id}`} className="block">
        <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 relative flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/80 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-blue-600">{collection.routeCount}</span>
            <span className="text-sm text-blue-500 ml-1">
              {collection.routeCount === 1 ? 'route' : 'routes'}
            </span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/collections/${collection.id}`} className="block">
          <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600">
            {collection.name}
          </h3>
        </Link>

        {collection.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {collection.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{formatDistance(collection.totalDistanceM)}</span>
          </div>

          {collection.totalElevationGainM > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{collection.totalElevationGainM}m</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(collection.createdAt)}
          </span>

          <div className="flex items-center gap-1">
            <Link
              to={`/collections/${collection.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="View collection"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete collection"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
