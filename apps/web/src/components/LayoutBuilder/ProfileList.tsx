import { DataProfile, DEVICE_PRESETS } from '@peloton/shared';

interface ProfileListProps {
  profiles: DataProfile[];
  onSelect: (profile: DataProfile) => void;
  onDelete: (profileId: string) => void;
  onSetActive: (profileId: string) => void;
}

export function ProfileList({ profiles, onSelect, onDelete, onSetActive }: ProfileListProps) {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Create a profile to configure your data screens for different riding styles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid gap-4">
        {profiles.map((profile) => {
          const device = DEVICE_PRESETS[profile.deviceType];

          return (
            <div
              key={profile.id}
              className={`bg-white rounded-lg border ${
                profile.isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className="p-4 flex items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${profile.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <svg
                    className={`w-6 h-6 ${profile.isActive ? 'text-blue-600' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelect(profile)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{profile.name}</h3>
                    {profile.isActive && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{device?.name || profile.deviceType}</span>
                    <span>•</span>
                    <span>Created {formatDate(profile.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!profile.isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetActive(profile.id);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(profile);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit profile"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(profile.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete profile"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
