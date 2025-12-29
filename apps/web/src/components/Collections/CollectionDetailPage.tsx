import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RouteCollectionWithRoutes } from '@peloton/shared';
import { useCollections } from '@/hooks/useCollections';
import { MultiRouteMap } from './MultiRouteMap';
import { DraggableRouteList } from './DraggableRouteList';

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCollectionWithRoutes, deleteCollection, removeRouteFromCollection, reorderRoutes, updateCollection } = useCollections();

  const [collection, setCollection] = useState<RouteCollectionWithRoutes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedRouteId, setHighlightedRouteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    async function fetchCollection() {
      if (!id) {
        setError('No collection ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const data = await getCollectionWithRoutes(id);
      if (data) {
        setCollection(data);
        setEditName(data.name);
        setEditDescription(data.description || '');
      } else {
        setError('Collection not found');
      }

      setLoading(false);
    }

    fetchCollection();
  }, [id, getCollectionWithRoutes]);

  const handleDelete = async () => {
    if (!collection) return;

    if (window.confirm(`Are you sure you want to delete "${collection.name}"? Routes in this collection will not be deleted.`)) {
      const success = await deleteCollection(collection.id);
      if (success) {
        navigate('/collections');
      }
    }
  };

  const handleRemoveRoute = async (routeId: string) => {
    if (!collection) return;

    const route = collection.routes.find((r) => r.id === routeId);
    if (route && window.confirm(`Remove "${route.name}" from this collection?`)) {
      await removeRouteFromCollection(collection.id, routeId);
      setCollection({
        ...collection,
        routes: collection.routes.filter((r) => r.id !== routeId),
      });
    }
  };

  const handleReorder = async (routeIds: string[]) => {
    if (!collection) return;

    await reorderRoutes(collection.id, routeIds);
    // Update local state with new order
    const reorderedRoutes = routeIds
      .map((id) => collection.routes.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined);
    setCollection({
      ...collection,
      routes: reorderedRoutes,
    });
  };

  const handleSaveEdit = async () => {
    if (!collection || !editName.trim()) return;

    await updateCollection(collection.id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });

    setCollection({
      ...collection,
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Calculate stats
  const totalDistance = collection?.routes.reduce((sum, r) => sum + r.distanceM, 0) || 0;
  const totalElevation = collection?.routes.reduce((sum, r) => sum + (r.elevationGainM || 0), 0) || 0;
  const routeCount = collection?.routes.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Collection not found</h2>
        <p className="text-gray-500 mb-6">{error || 'The collection you are looking for does not exist.'}</p>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to collections
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/collections"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {isEditing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xl font-semibold px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(collection.name);
                    setEditDescription(collection.description || '');
                  }}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{collection.name}</h1>
                {collection.description && (
                  <p className="text-sm text-gray-500">{collection.description}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-gray-600">Routes:</span>
            <span className="font-medium">{routeCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-gray-600">Total Distance:</span>
            <span className="font-medium">{formatDistance(totalDistance)}</span>
          </div>

          {totalElevation > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="text-gray-600">Total Elevation:</span>
              <span className="font-medium">{totalElevation}m</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MultiRouteMap
            routes={collection.routes}
            highlightedRouteId={highlightedRouteId}
            onRouteClick={(routeId) => setHighlightedRouteId(routeId)}
          />
        </div>

        {/* Route List */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-3 border-b bg-gray-50">
            <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
              Collection Routes
            </h2>
          </div>
          <DraggableRouteList
            routes={collection.routes}
            onReorder={handleReorder}
            onRemove={handleRemoveRoute}
            onRouteHover={setHighlightedRouteId}
          />
        </div>
      </div>
    </div>
  );
}
