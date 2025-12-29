import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Route } from '@peloton/shared';

const ROUTE_COLORS = ['#0066cc', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d', '#ca8a04'];

interface SortableRouteItemProps {
  route: Route;
  index: number;
  onRemove: () => void;
  onHover: (routeId: string | null) => void;
}

function SortableRouteItem({ route, index, onRemove, onHover }: SortableRouteItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: route.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const color = ROUTE_COLORS[index % ROUTE_COLORS.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border-b border-gray-100 hover:bg-gray-50"
      onMouseEnter={() => onHover(route.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>

      {/* Color indicator */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Route info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/routes/${route.id}`}
          className="font-medium text-gray-900 hover:text-blue-600 truncate block"
        >
          {route.name}
        </Link>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
          <span>{formatDistance(route.distanceM)}</span>
          {route.elevationGainM && route.elevationGainM > 0 && (
            <span>+{route.elevationGainM}m</span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
        title="Remove from collection"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface DraggableRouteListProps {
  routes: Route[];
  onReorder: (routeIds: string[]) => void;
  onRemove: (routeId: string) => void;
  onRouteHover: (routeId: string | null) => void;
}

export function DraggableRouteList({ routes, onReorder, onRemove, onRouteHover }: DraggableRouteListProps) {
  const [items, setItems] = useState(routes);

  // Update items when routes prop changes
  if (routes.length !== items.length || routes.some((r, i) => r.id !== items[i]?.id)) {
    setItems(routes);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems.map((item) => item.id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <svg
          className="w-12 h-12 mx-auto text-gray-300 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-sm">No routes in this collection yet</p>
        <p className="text-xs text-gray-400 mt-1">Add routes from the Routes page</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((r) => r.id)} strategy={verticalListSortingStrategy}>
        <div className="divide-y divide-gray-100">
          {items.map((route, index) => (
            <SortableRouteItem
              key={route.id}
              route={route}
              index={index}
              onRemove={() => onRemove(route.id)}
              onHover={onRouteHover}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
