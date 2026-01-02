import { useState } from 'react';
import {
  ProfileScreen,
  Widget,
  DEVICE_PRESETS,
  WIDGET_DEFINITIONS,
  WIDGET_CATEGORIES,
  WidgetType,
  WidgetCategory,
  SCREEN_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type ScreenTemplate,
  adaptTemplateToGrid,
  // Layout presets
  LAYOUT_PRESETS,
  type LayoutMode,
  type LayoutPreset,
  type SlotAssignment,
  getLayoutPresetById,
} from '@peloton/shared';
import { InteractivePhoneSimulator } from './InteractivePhoneSimulator';
import { PriorityLayoutSimulator } from './PriorityLayoutSimulator';

interface ScreenEditorProps {
  screen: ProfileScreen;
  deviceType: string;
  onUpdateScreen: (
    screenId: string,
    updates: {
      name?: string;
      gridColumns?: number;
      gridRows?: number;
      widgets?: Widget[];
      layoutMode?: LayoutMode;
      layoutPresetId?: string;
      slotAssignments?: SlotAssignment[];
    }
  ) => void;
  selectedWidget: Widget | null;
  onSelectWidget: (widget: Widget | null) => void;
}

type SidebarTab = 'widgets' | 'templates' | 'presets';

// Inline confirmation dialog component
function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'warning';
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${
              variant === 'warning'
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Slot properties panel for priority mode
function SlotPropertiesPanel({
  slot,
  assignment,
  onRemove,
}: {
  slot: { id: string; priority: number; sizeClass: string; heightPercent: number; widthPercent: number };
  assignment?: SlotAssignment;
  onRemove: () => void;
}) {
  const widgetDef = assignment ? WIDGET_DEFINITIONS[assignment.widgetType] : null;

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* Slot info header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              slot.sizeClass === 'primary' ? 'bg-blue-500 text-white' :
              slot.sizeClass === 'secondary' ? 'bg-green-500 text-white' :
              slot.sizeClass === 'tertiary' ? 'bg-amber-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              {slot.priority}
            </span>
            <div>
              <p className="text-gray-900 font-medium capitalize">{slot.sizeClass} Slot</p>
              <p className="text-xs text-gray-500">{slot.widthPercent}% × {slot.heightPercent}%</p>
            </div>
          </div>
        </div>

        <hr />

        {widgetDef ? (
          <>
            {/* Assigned widget info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <label className="block text-xs font-medium text-blue-600 mb-1">ASSIGNED WIDGET</label>
              <p className="text-gray-900 font-semibold">{widgetDef.label}</p>
              {widgetDef.unit && (
                <p className="text-sm text-gray-500 mt-0.5">{widgetDef.unit}</p>
              )}
            </div>

            <p className="text-xs text-gray-500">{widgetDef.description}</p>

            {/* Remove button */}
            <button
              onClick={onRemove}
              className="w-full px-3 py-2.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Widget
            </button>
            <p className="text-xs text-gray-400 text-center">or press Delete key</p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No widget assigned</p>
            <p className="text-xs text-gray-400 mt-1">Select a widget from the Widgets tab</p>
          </div>
        )}
      </div>
    </div>
  );
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
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('widgets');
  const [widgetCategory, setWidgetCategory] = useState<WidgetCategory | 'all'>('all');
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'warning';
  } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Layout mode state
  const layoutMode: LayoutMode = screen.layoutMode || 'grid';
  const currentPreset = screen.layoutPresetId ? (getLayoutPresetById(screen.layoutPresetId) ?? null) : null;
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(4); // Default scale factor

  const device = DEVICE_PRESETS[deviceType];

  // Handler to switch layout mode
  const handleLayoutModeChange = (mode: LayoutMode) => {
    if (mode === layoutMode) return;

    if (mode === 'priority') {
      // Switching to priority mode - set default preset
      onUpdateScreen(screen.id, {
        layoutMode: 'priority',
        layoutPresetId: 'standard',
        slotAssignments: [],
      });
      setSidebarTab('presets');
    } else {
      // Switching to grid mode
      onUpdateScreen(screen.id, {
        layoutMode: 'grid',
      });
      setSidebarTab('widgets');
    }
    setSelectedSlotId(null);
    onSelectWidget(null);
  };

  // Handler to select a layout preset
  const handleSelectPreset = (preset: LayoutPreset) => {
    onUpdateScreen(screen.id, {
      layoutPresetId: preset.id,
      slotAssignments: [], // Clear assignments when changing preset
    });
    setSelectedSlotId(null);
  };

  // Handler to select a slot (auto-switch to widgets tab)
  const handleSlotSelect = (slotId: string | null) => {
    setSelectedSlotId(slotId);
    if (slotId) {
      setSidebarTab('widgets'); // Auto-switch to widgets when slot is selected
    }
  };

  // Handler to assign a widget to a slot
  const handleAssignWidgetToSlot = (slotId: string, widgetType: WidgetType) => {
    const currentAssignments = screen.slotAssignments || [];
    const newAssignments = currentAssignments.filter((a) => a.slotId !== slotId);
    newAssignments.push({ slotId, widgetType });
    onUpdateScreen(screen.id, { slotAssignments: newAssignments });
    // Keep slot selected so user can see the assignment
  };

  // Handler to remove a widget from a slot
  const handleRemoveSlotAssignment = (slotId: string) => {
    const currentAssignments = screen.slotAssignments || [];
    const newAssignments = currentAssignments.filter((a) => a.slotId !== slotId);
    onUpdateScreen(screen.id, { slotAssignments: newAssignments });
  };

  const handleSaveName = () => {
    if (editName.trim() && editName !== screen.name) {
      onUpdateScreen(screen.id, { name: editName.trim() });
    }
    setIsEditingName(false);
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
      setNotification('No space available for this widget. Remove some widgets first.');
      setTimeout(() => setNotification(null), 3000);
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

  const handleApplyTemplate = (template: ScreenTemplate) => {
    const { widgets, warnings } = adaptTemplateToGrid(
      template,
      screen.gridColumns,
      screen.gridRows
    );

    const applyTemplate = () => {
      onUpdateScreen(screen.id, { widgets });
      onSelectWidget(null);
      setConfirmDialog(null);
    };

    if (warnings.length > 0) {
      setConfirmDialog({
        title: 'Some widgets won\'t fit',
        message: `Some widgets from "${template.name}" won't fit your grid:\n\n${warnings.join('\n')}\n\nReplace current layout with the widgets that fit?`,
        onConfirm: applyTemplate,
        variant: 'warning',
      });
    } else if (screen.widgets.length > 0) {
      setConfirmDialog({
        title: 'Replace layout?',
        message: `Replace current layout with "${template.name}" template?`,
        onConfirm: applyTemplate,
      });
    } else {
      applyTemplate();
    }
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

  // Filter widgets by category and search
  const allWidgets = Object.values(WIDGET_DEFINITIONS);
  const filteredWidgets = allWidgets.filter((widget) => {
    const matchesCategory = widgetCategory === 'all' || widget.category === widgetCategory;
    const matchesSearch =
      !searchQuery ||
      widget.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter templates
  const filteredTemplates = SCREEN_TEMPLATES.filter((template) => {
    const matchesCategory = templateCategory === 'all' || template.category === templateCategory;
    const matchesSearch =
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Map screen just shows a placeholder
  if (screen.screenType === 'map') {
    return (
      <div className="h-full flex flex-col">
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
      {/* Left sidebar - Widgets, Templates, or Presets */}
      <div className="w-72 bg-white border-r flex flex-col">
        {/* Tabs - different based on layout mode */}
        {layoutMode === 'grid' ? (
          <div className="flex border-b">
            <button
              onClick={() => setSidebarTab('widgets')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'widgets'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Widgets
            </button>
            <button
              onClick={() => setSidebarTab('templates')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'templates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
          </div>
        ) : (
          <div className="flex border-b">
            <button
              onClick={() => setSidebarTab('presets')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'presets'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setSidebarTab('widgets')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'widgets'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Widgets
            </button>
          </div>
        )}

        {/* Search - only for widgets/templates */}
        {sidebarTab !== 'presets' && (
          <div className="p-3 border-b">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={sidebarTab === 'widgets' ? 'Search widgets...' : 'Search templates...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Category filter - only for widgets/templates */}
        {sidebarTab === 'widgets' && (
          <div className="p-3 border-b">
            <select
              value={widgetCategory}
              onChange={(e) => setWidgetCategory(e.target.value as WidgetCategory | 'all')}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="all">All Categories</option>
              {WIDGET_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        )}
        {sidebarTab === 'templates' && (
          <div className="p-3 border-b">
            <select
              value={templateCategory}
              onChange={(e) => setTemplateCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
            >
              <option value="all">All Categories</option>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {sidebarTab === 'widgets' && (
            <div className="space-y-1">
              {filteredWidgets.map((widget) => (
                <button
                  key={widget.type}
                  onClick={() => {
                    if (layoutMode === 'priority' && selectedSlotId) {
                      handleAssignWidgetToSlot(selectedSlotId, widget.type);
                    } else if (layoutMode === 'grid') {
                      handleAddWidget(widget.type);
                    } else {
                      setNotification('Select a slot first to assign a widget');
                      setTimeout(() => setNotification(null), 3000);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                    layoutMode === 'priority' && selectedSlotId
                      ? 'hover:bg-blue-50 hover:border-blue-300 border border-transparent'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600">
                    {widget.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {widget.unit && <span className="mr-2">{widget.unit}</span>}
                    {widget.requiresGPS && <span className="text-green-600 mr-1">GPS</span>}
                    {widget.requiresSensor && <span className="text-orange-600">{widget.sensorType}</span>}
                  </div>
                </button>
              ))}
              {filteredWidgets.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">No widgets found</p>
              )}
            </div>
          )}
          {sidebarTab === 'templates' && (
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {template.widgets.length} widgets
                  </div>
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">No templates found</p>
              )}
            </div>
          )}
          {sidebarTab === 'presets' && (
            <div className="space-y-2">
              {LAYOUT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentPreset?.id === preset.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                    <div className="text-xs text-gray-400">{preset.fieldCount} fields</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                  {/* Mini preview */}
                  <div className="mt-2 flex gap-0.5">
                    {preset.slots.slice(0, 5).map((slot) => (
                      <div
                        key={slot.id}
                        className={`h-3 bg-gray-300 rounded-sm ${
                          slot.sizeClass === 'primary' ? 'flex-[2]' :
                          slot.sizeClass === 'secondary' ? 'flex-[1.5]' :
                          slot.sizeClass === 'tertiary' ? 'flex-1' : 'flex-[0.75]'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center - Phone Simulator (main editor) */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          {/* Left: Name */}
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

          {/* Center: Layout mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleLayoutModeChange('grid')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => handleLayoutModeChange('priority')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                layoutMode === 'priority'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Priority
            </button>
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewScale(Math.max(2, previewScale - 0.5))}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="range"
              min="2"
              max="6"
              step="0.5"
              value={previewScale}
              onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              title={`Zoom: ${Math.round(previewScale * 25)}%`}
            />
            <button
              onClick={() => setPreviewScale(Math.min(6, previewScale + 0.5))}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-xs text-gray-400 w-8">{Math.round(previewScale * 25)}%</span>
          </div>

          {/* Right: Device/preset info */}
          <div className="text-sm text-gray-500">
            {layoutMode === 'grid' ? (
              <>{device?.name} • {screen.gridColumns}×{screen.gridRows} grid</>
            ) : (
              <>{currentPreset?.name || 'Select preset'} • {currentPreset?.fieldCount || 0} fields</>
            )}
          </div>
        </div>

        {/* Phone simulator */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          {layoutMode === 'grid' ? (
            <InteractivePhoneSimulator
              deviceType={deviceType}
              screen={screen}
              selectedWidgetId={selectedWidget?.id || null}
              onWidgetSelect={(widgetId) => {
                if (widgetId) {
                  const widget = screen.widgets.find((w) => w.id === widgetId);
                  onSelectWidget(widget || null);
                } else {
                  onSelectWidget(null);
                }
              }}
              onWidgetMove={handleWidgetMove}
              onWidgetDelete={handleWidgetDelete}
              scale={previewScale}
            />
          ) : (
            <PriorityLayoutSimulator
              deviceType={deviceType}
              preset={currentPreset}
              slotAssignments={screen.slotAssignments || []}
              selectedSlotId={selectedSlotId}
              onSlotSelect={handleSlotSelect}
              onRemoveAssignment={handleRemoveSlotAssignment}
              scale={previewScale}
            />
          )}
        </div>

        {/* Help text */}
        <div className="bg-white border-t px-4 py-2 text-center text-xs text-gray-500">
          {layoutMode === 'grid' ? (
            <>Click widgets to select • Add from sidebar • Press Delete to remove</>
          ) : selectedSlotId ? (
            <>Select a widget from sidebar • Press Delete to remove</>
          ) : (
            <>Click a slot to select it • Choose preset from sidebar</>
          )}
        </div>
      </div>

      {/* Right sidebar - Properties */}
      <div className="w-64 bg-white border-l overflow-y-auto">
        <div className="p-3 border-b bg-gray-50">
          <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
            Properties
          </h2>
        </div>

        {/* Grid mode - widget properties */}
        {layoutMode === 'grid' && selectedWidget ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Widget</label>
                <p className="text-gray-900 font-medium">{WIDGET_DEFINITIONS[selectedWidget.type].label}</p>
                <p className="text-xs text-gray-500 mt-1">{WIDGET_DEFINITIONS[selectedWidget.type].description}</p>
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

              {WIDGET_DEFINITIONS[selectedWidget.type].unit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <p className="text-sm text-gray-500">{WIDGET_DEFINITIONS[selectedWidget.type].unit}</p>
                </div>
              )}

              <hr />

              <button
                onClick={() => handleWidgetDelete(selectedWidget.id)}
                className="w-full px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Delete Widget
              </button>
            </div>
          </div>
        ) : layoutMode === 'priority' && selectedSlotId && currentPreset ? (
          // Priority mode - slot properties
          <SlotPropertiesPanel
            slot={currentPreset.slots.find((s) => s.id === selectedSlotId)!}
            assignment={screen.slotAssignments?.find((a) => a.slotId === selectedSlotId)}
            onRemove={() => handleRemoveSlotAssignment(selectedSlotId)}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-sm">
              {layoutMode === 'grid' ? 'Select a widget to edit' : 'Select a slot to assign'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {layoutMode === 'grid' ? 'or add widgets from the sidebar' : 'click a slot, then choose a widget'}
            </p>
          </div>
        )}
      </div>

      {/* In-page confirmation dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          variant={confirmDialog.variant}
          confirmLabel="Apply Template"
          cancelLabel="Cancel"
        />
      )}

      {/* Notification toast */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
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
