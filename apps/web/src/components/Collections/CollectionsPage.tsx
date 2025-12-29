import { useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useRoutes } from '@/hooks/useRoutes';
import { CollectionCard } from './CollectionCard';
import { CollectionListItem } from './CollectionListItem';
import { CreateCollectionDialog } from './CreateCollectionDialog';
import { MultiRouteMap } from './MultiRouteMap';

type ViewMode = 'map' | 'grid' | 'list';

export function CollectionsPage() {
  const { collections, loading, error, deleteCollection, createCollection } = useCollections();
  const { routes } = useRoutes();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the collection "${name}"? Routes in this collection will not be deleted.`)) {
      await deleteCollection(id);
    }
  };

  const handleCreateCollection = async (name: string, description?: string) => {
    await createCollection({ name, description });
    setShowCreateDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
          <p className="text-gray-500 text-sm mt-1">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Collection
        </button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 ${viewMode === 'map' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            title="Map view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Collections Display */}
      {viewMode === 'map' ? (
        <div className="h-[calc(100vh-280px)] min-h-[400px] rounded-lg overflow-hidden border border-gray-200">
          {routes.length > 0 ? (
            <MultiRouteMap routes={routes} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <p className="text-gray-500">No routes to display on map</p>
            </div>
          )}
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <p className="text-gray-500 mb-2">No collections match your search</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 mb-4">You haven't created any collections yet</p>
              <p className="text-gray-400 text-sm mb-4">
                Collections help you organize routes by region, event, or riding style
              </p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create your first collection
              </button>
            </>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onDelete={() => handleDelete(collection.id, collection.name)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {filteredCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              collection={collection}
              onDelete={() => handleDelete(collection.id, collection.name)}
            />
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      {showCreateDialog && (
        <CreateCollectionDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateCollection}
        />
      )}
    </div>
  );
}
