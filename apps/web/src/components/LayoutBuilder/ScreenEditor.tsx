import { useState } from 'react';
import {
  ProfileScreen,
  Widget,
  DEVICE_PRESETS,
  WIDGET_DEFINITIONS,
  WidgetType,
  MIN_GRID_COLUMNS,
  MAX_GRID_COLUMNS,
  MIN_GRID_ROWS,
  MAX_GRID_ROWS,
} from '@peloton/shared';
import { WidgetCanvas } from './WidgetCanvas';
import { WidgetLibrary } from './WidgetLibrary';

interface ScreenEditorProps {
  screen: ProfileScreen;
  deviceType: string;
  onUpdateScreen: (
    screenId: string,
    updates: { name?: string; gridColumns?: number; gridRows?: number; widgets?: Widget[] }
  ) => void;
  selectedWidget: Widget | null;
  onSelectWidget: (widget: Widget | null) => void;
}

export function ScreenEditor({
  screen,
  deviceType,
  onUpdateScreen,
  selectedWidget,
  onSelectWidget,
}: ScreenEditorProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(screen.name);

  const device = DEVICE_PRESETS[deviceType];

  const handleSaveName = () => {
    if (editName.trim() && editName !== screen.name) {
      onUpdateScreen(screen.id, { name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleGridChange = (columns: number, rows: number) => {
    // Validate widgets still fit
    const invalidWidgets = screen.widgets.filter(
      (w) => w.x + w.width > columns || w.y + w.height > rows
    );
    if (invalidWidgets.length > 0) {
      if (!window.confirm(`${invalidWidgets.length} widget(s) will be removed because they don't fit in the new grid. Continue?`)) {
        return;
      }
    }

    const validWidgets = screen.widgets.filter(
      (w) => w.x + w.width <= columns && w.y + w.height <= rows
    );

    onUpdateScreen(screen.id, {
      gridColumns: columns,
      gridRows: rows,
      widgets: validWidgets,
    });
  };

  const handleAddWidget = (widgetType: WidgetType) => {
    const widgetDef = WIDGET_DEFINITIONS[widgetType];

    // Find empty space for the widget
    const position = findEmptySpace(
      screen.widgets,
      screen.gridColumns,
      screen.gridRows,
      widgetDef.defaultWidth,
      widgetDef.defaultHeight
    );

    if (!position) {
      alert('No space available for this widget. Remove some widgets or increase grid size.');
      return;
    }

    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type: widgetType,
      x: position.x,
      y: position.y,
      width: widgetDef.defaultWidth,
      height: widgetDef.defaultHeight,
    };

    onUpdateScreen(screen.id, {
      widgets: [...screen.widgets, newWidget],
    });
  };

  const handleWidgetMove = (widgetId: string, x: number, y: number) => {
    const widget = screen.widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    // Validate position
    if (x < 0 || y < 0 || x + widget.width > screen.gridColumns || y + widget.height > screen.gridRows) {
      return;
    }

    // Check for overlaps with other widgets
    const hasOverlap = screen.widgets.some((w) => {
      if (w.id === widgetId) return false;
      return rectanglesOverlap(
        { x, y, width: widget.width, height: widget.height },
        w
      );
    });

    if (hasOverlap) return;

    onUpdateScreen(screen.id, {
      widgets: screen.widgets.map((w) =>
        w.id === widgetId ? { ...w, x, y } : w
      ),
    });
  };

  const handleWidgetResize = (widgetId: string, width: number, height: number) => {
    const widget = screen.widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    const widgetDef = WIDGET_DEFINITIONS[widget.type];

    // Validate size
    const minWidth = widgetDef.minWidth || 1;
    const minHeight = widgetDef.minHeight || 1;
    const clampedWidth = Math.max(minWidth, Math.min(width, screen.gridColumns - widget.x));
    const clampedHeight = Math.max(minHeight, Math.min(height, screen.gridRows - widget.y));

    // Check for overlaps
    const hasOverlap = screen.widgets.some((w) => {
      if (w.id === widgetId) return false;
      return rectanglesOverlap(
        { x: widget.x, y: widget.y, width: clampedWidth, height: clampedHeight },
        w
      );
    });

    if (hasOverlap) return;

    onUpdateScreen(screen.id, {
      widgets: screen.widgets.map((w) =>
        w.id === widgetId ? { ...w, width: clampedWidth, height: clampedHeight } : w
      ),
    });
  };

  const handleWidgetDelete = (widgetId: string) => {
    onUpdateScreen(screen.id, {
      widgets: screen.widgets.filter((w) => w.id !== widgetId),
    });
    if (selectedWidget?.id === widgetId) {
      onSelectWidget(null);
    }
  };

  // Map screen just shows a placeholder
  if (screen.screenType === 'map') {
    return (
      <div className="h-full flex flex-col">
        {/* Screen name editor */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto">
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') {
                      setEditName(screen.name);
                      setIsEditingName(false);
                    }
                  }}
                />
                <button onClick={handleSaveName} className="px-3 py-1 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-lg font-medium text-gray-900 hover:text-blue-600"
              >
                {screen.name}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map Screen</h3>
            <p className="text-gray-500">
              This screen will display a full-screen map during your ride.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left sidebar - Widget Library */}
      <div className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-3 border-b bg-gray-50">
          <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
            Widgets
          </h2>
        </div>
        <WidgetLibrary onAddWidget={handleAddWidget} />
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Screen settings bar */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Name */}
            {isEditingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') {
                      setEditName(screen.name);
                      setIsEditingName(false);
                    }
                  }}
                />
                <button onClick={handleSaveName} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {screen.name}
              </button>
            )}

            {/* Grid settings */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Grid:</label>
                <select
                  value={screen.gridColumns}
                  onChange={(e) => handleGridChange(parseInt(e.target.value), screen.gridRows)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {Array.from({ length: MAX_GRID_COLUMNS - MIN_GRID_COLUMNS + 1 }, (_, i) => i + MIN_GRID_COLUMNS).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-gray-400">×</span>
                <select
                  value={screen.gridRows}
                  onChange={(e) => handleGridChange(screen.gridColumns, parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {Array.from({ length: MAX_GRID_ROWS - MIN_GRID_ROWS + 1 }, (_, i) => i + MIN_GRID_ROWS).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {device && (
                <button
                  onClick={() => handleGridChange(device.suggestedGrid.columns, device.suggestedGrid.rows)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset to device default
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <div className="flex items-center justify-center min-h-full">
            <WidgetCanvas
              widgets={screen.widgets}
              gridColumns={screen.gridColumns}
              gridRows={screen.gridRows}
              selectedWidgetId={selectedWidget?.id || null}
              onWidgetSelect={(widgetId) => {
                const widget = screen.widgets.find((w) => w.id === widgetId);
                onSelectWidget(widget || null);
              }}
              onWidgetMove={handleWidgetMove}
              onWidgetDelete={handleWidgetDelete}
            />
          </div>
        </div>
      </div>

      {/* Right sidebar - Widget Properties */}
      <div className="w-64 bg-white border-l overflow-y-auto">
        <div className="p-3 border-b bg-gray-50">
          <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
            Properties
          </h2>
        </div>

        {selectedWidget ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-gray-900">{WIDGET_DEFINITIONS[selectedWidget.type].label}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={selectedWidget.width}
                    min={WIDGET_DEFINITIONS[selectedWidget.type].minWidth || 1}
                    max={screen.gridColumns - selectedWidget.x}
                    onChange={(e) => handleWidgetResize(selectedWidget.id, parseInt(e.target.value), selectedWidget.height)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-400">×</span>
                  <input
                    type="number"
                    value={selectedWidget.height}
                    min={WIDGET_DEFINITIONS[selectedWidget.type].minHeight || 1}
                    max={screen.gridRows - selectedWidget.y}
                    onChange={(e) => handleWidgetResize(selectedWidget.id, selectedWidget.width, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <p className="text-sm text-gray-500">
                  Column {selectedWidget.x + 1}, Row {selectedWidget.y + 1}
                </p>
              </div>

              <hr />

              <button
                onClick={() => handleWidgetDelete(selectedWidget.id)}
                className="w-full px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Delete Widget
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>Select a widget to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function findEmptySpace(
  widgets: Widget[],
  gridColumns: number,
  gridRows: number,
  width: number,
  height: number
): { x: number; y: number } | null {
  for (let y = 0; y <= gridRows - height; y++) {
    for (let x = 0; x <= gridColumns - width; x++) {
      const candidate = { x, y, width, height };
      const hasOverlap = widgets.some((w) => rectanglesOverlap(candidate, w));
      if (!hasOverlap) {
        return { x, y };
      }
    }
  }
  return null;
}

function rectanglesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}
