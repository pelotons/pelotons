import { useEffect, useRef } from 'react';
import { WaypointType } from '@peloton/shared';

interface WaypointContextMenuProps {
  x: number;
  y: number;
  waypointIndex: number;
  waypointType: WaypointType | undefined;
  totalWaypoints: number;
  onSetAsStart: (index: number) => void;
  onSetAsEnd: (index: number) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
}

export function WaypointContextMenu({
  x,
  y,
  waypointIndex,
  waypointType,
  totalWaypoints,
  onSetAsStart,
  onSetAsEnd,
  onDelete,
  onClose,
}: WaypointContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 180);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-100">
        Waypoint {waypointIndex + 1}
        {waypointType === 'start' && ' (Start)'}
        {waypointType === 'end' && ' (End)'}
        {waypointType === 'poi' && ' (POI)'}
      </div>

      {waypointType !== 'start' && waypointIndex > 0 && (
        <button
          onClick={() => {
            onSetAsStart(waypointIndex);
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm flex-shrink-0" />
          Set as Start
        </button>
      )}

      {waypointType !== 'end' && waypointIndex < totalWaypoints - 1 && (
        <button
          onClick={() => {
            onSetAsEnd(waypointIndex);
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          <span className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm flex-shrink-0" />
          Set as End
        </button>
      )}

      {totalWaypoints > 2 && (
        <>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => {
              onDelete(waypointIndex);
              onClose();
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Waypoint
          </button>
        </>
      )}
    </div>
  );
}
