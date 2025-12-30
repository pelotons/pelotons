import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBikes } from '@/hooks/useBikes';
import {
  Bike,
  BIKE_TYPE_LABELS,
  FRAME_MATERIAL_LABELS,
} from '@peloton/shared';

export function BikeList() {
  const { bikes, loading, error, deleteBike, setDefaultBike } = useBikes();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error loading bikes</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bikes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your bike inventory, geometry, and fit settings
          </p>
        </div>
        <Link
          to="/bikes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Bike
        </Link>
      </div>

      {/* Empty state */}
      {bikes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <BikeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bikes yet</h3>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Add your first bike to start tracking geometry, fit settings, and components.
          </p>
          <Link
            to="/bikes/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Bike
          </Link>
        </div>
      )}

      {/* Bike list */}
      <div className="space-y-4">
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            isDeleteConfirming={deleteConfirm === bike.id}
            onSetDefault={() => setDefaultBike(bike.id)}
            onDeleteClick={() => setDeleteConfirm(bike.id)}
            onDeleteCancel={() => setDeleteConfirm(null)}
            onDeleteConfirm={async () => {
              await deleteBike(bike.id);
              setDeleteConfirm(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface BikeCardProps {
  bike: Bike;
  isDeleteConfirming: boolean;
  onSetDefault: () => void;
  onDeleteClick: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

function BikeCard({
  bike,
  isDeleteConfirming,
  onSetDefault,
  onDeleteClick,
  onDeleteCancel,
  onDeleteConfirm,
}: BikeCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Photo */}
        <div className="w-32 h-32 bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {bike.photoUrl ? (
            <img
              src={bike.photoUrl}
              alt={bike.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <BikeIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/bikes/${bike.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  {bike.name}
                </Link>
                {bike.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
                {!bike.isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {[
                  bike.brand,
                  bike.model,
                  bike.year,
                  bike.frameSize,
                ].filter(Boolean).join(' • ') || 'No details'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isDeleteConfirming ? (
                <>
                  {!bike.isDefault && bike.isActive && (
                    <button
                      onClick={onSetDefault}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50"
                      title="Set as default"
                    >
                      <StarIcon className="w-5 h-5" />
                    </button>
                  )}
                  <Link
                    to={`/bikes/${bike.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                    title="Edit bike"
                  >
                    <EditIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={onDeleteClick}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                    title="Delete bike"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Delete?</span>
                  <button
                    onClick={onDeleteConfirm}
                    className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={onDeleteCancel}
                    className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <BikeTypeIcon type={bike.bikeType} className="w-4 h-4" />
              {BIKE_TYPE_LABELS[bike.bikeType]}
            </span>
            {bike.frameMaterial && (
              <span className="text-xs text-gray-500">
                {FRAME_MATERIAL_LABELS[bike.frameMaterial]}
              </span>
            )}
            {bike.weightKg && (
              <span className="text-xs text-gray-500">
                {bike.weightKg} kg
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function BikeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="5.5" cy="17.5" r="3.5" strokeWidth={1.5} />
      <circle cx="18.5" cy="17.5" r="3.5" strokeWidth={1.5} />
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5.5 17.5L9 10l3 7.5M18.5 17.5L15 10l-3 3M9 10l3-3h4l2 3" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function BikeTypeIcon({ type, className }: { type: string; className?: string }) {
  // Simple icon variations based on bike type
  const icons: Record<string, JSX.Element> = {
    road: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="5" cy="17" r="3" strokeWidth={1.5} />
        <circle cx="19" cy="17" r="3" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M5 17l4-7 6 7M19 17l-4-7" />
      </svg>
    ),
    mountain: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="5" cy="17" r="3.5" strokeWidth={1.5} />
        <circle cx="19" cy="17" r="3.5" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M5 17l4-7 6 7M19 17l-4-7" />
      </svg>
    ),
    gravel: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="5" cy="17" r="3" strokeWidth={1.5} />
        <circle cx="19" cy="17" r="3" strokeWidth={1.5} />
        <path strokeWidth={1.5} d="M5 17l4-7 6 7M19 17l-4-7" />
        <path strokeWidth={1} d="M4 20h1M19 20h1" />
      </svg>
    ),
  };

  return icons[type] || icons.road;
}
