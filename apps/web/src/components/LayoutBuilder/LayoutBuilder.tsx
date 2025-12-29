import { useState, useCallback } from 'react';
import { WidgetLibrary } from './WidgetLibrary';
import { WidgetCanvas } from './WidgetCanvas';
import { useLayouts } from '@/hooks/useLayouts';
import { Widget, WidgetType, WIDGET_DEFINITIONS, DATA_SCREEN_GRID } from '@peloton/shared';

const CELL_SIZE = 100;
const GRID_PADDING = 10;

export function LayoutBuilder() {
  const { layouts, createLayout, updateLayout, deleteLayout, setActiveLayout, loading } = useLayouts();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [name, setName] = useState('New Layout');
  const [editingLayoutId, setEditingLayoutId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);

  const handleAddWidget = useCallback((type: WidgetType) => {
    const definition = WIDGET_DEFINITIONS[type];

    // Find an empty spot
    let foundSpot = false;
    let newX = 0;
    let newY = 0;

    for (let y = 0; y < DATA_SCREEN_GRID.rows && !foundSpot; y++) {
      for (let x = 0; x < DATA_SCREEN_GRID.columns && !foundSpot; x++) {
        // Check if this position is occupied
        const occupied = widgets.some(
          (w) =>
            x >= w.x &&
            x < w.x + w.width &&
            y >= w.y &&
            y < w.y + w.height
        );
        if (!occupied) {
          newX = x;
          newY = y;
          foundSpot = true;
        }
      }
    }

    const newWidget: Widget = {
      id: `widget_${Date.now()}`,
      type,
      x: newX,
      y: newY,
      width: definition.defaultWidth,
      height: definition.defaultHeight,
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidgetId(newWidget.id);
  }, [widgets]);

  const handleWidgetDrag = useCallback((widgetId: string, newX: number, newY: number) => {
    // Convert pixel position to grid position
    const gridX = Math.max(
      0,
      Math.min(
        DATA_SCREEN_GRID.columns - 1,
        Math.round((newX - GRID_PADDING) / CELL_SIZE)
      )
    );
    const gridY = Math.max(
      0,
      Math.min(
        DATA_SCREEN_GRID.rows - 1,
        Math.round((newY - GRID_PADDING) / CELL_SIZE)
      )
    );

    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, x: gridX, y: gridY } : w
      )
    );
  }, []);

  const handleWidgetDelete = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    if (selectedWidgetId === widgetId) {
      setSelectedWidgetId(null);
    }
  }, [selectedWidgetId]);

  const handleSave = async () => {
    setSaving(true);

    if (editingLayoutId) {
      await updateLayout(editingLayoutId, {
        name,
        widgets,
      });
    } else {
      await createLayout({
        name,
        screenType: 'data',
        widgets,
        isActive: false,
      });
    }

    setSaving(false);
    handleClear();
  };

  const handleClear = () => {
    setWidgets([]);
    setSelectedWidgetId(null);
    setName('New Layout');
    setEditingLayoutId(null);
  };

  const handleLoadLayout = (layout: (typeof layouts)[0]) => {
    setWidgets(layout.widgets);
    setName(layout.name);
    setEditingLayoutId(layout.id);
    setShowLayouts(false);
    setSelectedWidgetId(null);
  };

  const handleDeleteLayout = async (id: string) => {
    if (confirm('Are you sure you want to delete this layout?')) {
      await deleteLayout(id);
    }
  };

  const handleSetActive = async (id: string) => {
    await setActiveLayout(id);
  };

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Widget Library Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Widgets</h2>
        <WidgetLibrary onAddWidget={handleAddWidget} />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-8 flex flex-col items-center overflow-y-auto">
        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1"
          />
          <button
            onClick={() => setShowLayouts(!showLayouts)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {showLayouts ? 'Back' : 'Saved Layouts'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || widgets.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingLayoutId ? 'Update' : 'Save'}
          </button>
          {widgets.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>

        {showLayouts ? (
          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Your Layouts</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : layouts.length === 0 ? (
              <p className="text-gray-500">No saved layouts yet</p>
            ) : (
              <div className="space-y-3">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`bg-white rounded-lg p-4 border ${
                      layout.isActive ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{layout.name}</h4>
                        <p className="text-sm text-gray-500">
                          {layout.widgets.length} widgets
                          {layout.isActive && (
                            <span className="ml-2 text-green-600 font-medium">
                              Active
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLoadLayout(layout)}
                          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Edit
                        </button>
                        {!layout.isActive && (
                          <button
                            onClick={() => handleSetActive(layout.id)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteLayout(layout.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <WidgetCanvas
            widgets={widgets}
            gridColumns={DATA_SCREEN_GRID.columns}
            gridRows={DATA_SCREEN_GRID.rows}
            selectedWidgetId={selectedWidgetId}
            onWidgetSelect={setSelectedWidgetId}
            onWidgetMove={handleWidgetDrag}
            onWidgetDelete={handleWidgetDelete}
          />
        )}

        {!showLayouts && widgets.length === 0 && (
          <p className="mt-4 text-gray-500 text-sm">
            Click widgets on the left to add them to your layout
          </p>
        )}
      </div>

      {/* Properties Panel */}
      <div className="w-64 bg-white border-l p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        {selectedWidget ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Type
              </label>
              <div className="text-sm text-gray-900">
                {WIDGET_DEFINITIONS[selectedWidget.type].label}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <div className="text-sm text-gray-500">
                Column {selectedWidget.x + 1}, Row {selectedWidget.y + 1}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <div className="text-sm text-gray-500">
                {selectedWidget.width}x{selectedWidget.height}
              </div>
            </div>

            <button
              onClick={() => handleWidgetDelete(selectedWidget.id)}
              className="w-full py-2 px-4 bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              Delete Widget
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Select a widget to edit its properties
          </p>
        )}

        <div className="mt-8 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tips</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>Drag widgets to reposition them</li>
            <li>Click a widget to select it</li>
            <li>The active layout syncs to mobile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
