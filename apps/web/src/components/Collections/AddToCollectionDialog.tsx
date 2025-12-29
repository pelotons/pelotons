import { useState, useEffect } from 'react';
import { RouteCollection } from '@peloton/shared';
import { useCollections } from '@/hooks/useCollections';

interface AddToCollectionDialogProps {
  routeId: string;
  routeName: string;
  onClose: () => void;
}

export function AddToCollectionDialog({ routeId, routeName, onClose }: AddToCollectionDialogProps) {
  const {
    collections,
    loading,
    createCollection,
    addRouteToCollection,
    removeRouteFromCollection,
    getCollectionsForRoute,
  } = useCollections();

  const [routeCollections, setRouteCollections] = useState<RouteCollection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loadingRouteCollections, setLoadingRouteCollections] = useState(true);

  // Load which collections this route is already in
  useEffect(() => {
    async function loadRouteCollections() {
      setLoadingRouteCollections(true);
      const existing = await getCollectionsForRoute(routeId);
      setRouteCollections(existing);
      setSelectedCollections(new Set(existing.map((c) => c.id)));
      setLoadingRouteCollections(false);
    }
    loadRouteCollections();
  }, [routeId, getCollectionsForRoute]);

  const handleToggleCollection = (collectionId: string) => {
    const newSelected = new Set(selectedCollections);
    if (newSelected.has(collectionId)) {
      newSelected.delete(collectionId);
    } else {
      newSelected.add(collectionId);
    }
    setSelectedCollections(newSelected);
  };

  const handleCreateNew = async () => {
    if (!newCollectionName.trim()) return;

    const newCollection = await createCollection({ name: newCollectionName.trim() });
    if (newCollection) {
      setSelectedCollections((prev) => new Set([...prev, newCollection.id]));
      setNewCollectionName('');
      setShowCreateNew(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    const originalCollectionIds = new Set(routeCollections.map((c) => c.id));

    // Add to new collections
    for (const collectionId of selectedCollections) {
      if (!originalCollectionIds.has(collectionId)) {
        await addRouteToCollection(collectionId, routeId);
      }
    }

    // Remove from unselected collections
    for (const collectionId of originalCollectionIds) {
      if (!selectedCollections.has(collectionId)) {
        await removeRouteFromCollection(collectionId, routeId);
      }
    }

    setIsSubmitting(false);
    onClose();
  };

  const isLoading = loading || loadingRouteCollections;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add to Collection</h2>
            <p className="text-sm text-gray-500 truncate">{routeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : collections.length === 0 && !showCreateNew ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 mb-4">No collections yet</p>
              <button
                onClick={() => setShowCreateNew(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Create your first collection
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((collection) => (
                <label
                  key={collection.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollections.has(collection.id)}
                    onChange={() => handleToggleCollection(collection.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{collection.name}</p>
                    <p className="text-xs text-gray-500">
                      {collection.routeCount} {collection.routeCount === 1 ? 'route' : 'routes'}
                    </p>
                  </div>
                  {routeCollections.some((c) => c.id === collection.id) && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </label>
              ))}

              {/* Create new collection inline */}
              {showCreateNew ? (
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateNew}
                      disabled={!newCollectionName.trim()}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateNew(false);
                        setNewCollectionName('');
                      }}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreateNew(true)}
                  className="flex items-center gap-2 w-full p-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create new collection
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
