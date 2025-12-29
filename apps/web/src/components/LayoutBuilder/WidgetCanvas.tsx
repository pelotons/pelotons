import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Widget, WIDGET_DEFINITIONS, LCD_COLORS } from '@peloton/shared';

const CELL_SIZE = 100;
const GRID_PADDING = 10;

interface WidgetCanvasProps {
  widgets: Widget[];
  gridColumns: number;
  gridRows: number;
  selectedWidgetId: string | null;
  onWidgetSelect: (id: string | null) => void;
  onWidgetMove: (id: string, x: number, y: number) => void;
  onWidgetDelete: (id: string) => void;
}

export function WidgetCanvas({
  widgets,
  gridColumns,
  gridRows,
  selectedWidgetId,
  onWidgetSelect,
  onWidgetMove,
}: WidgetCanvasProps) {
  const stageWidth = gridColumns * CELL_SIZE + GRID_PADDING * 2;
  const stageHeight = gridRows * CELL_SIZE + GRID_PADDING * 2;

  const handleDragEnd = (widgetId: string, e: any) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    // Convert pixel position to grid position
    const pixelX = e.target.x() - GRID_PADDING;
    const pixelY = e.target.y() - GRID_PADDING;

    // Snap to grid
    const gridX = Math.round(pixelX / CELL_SIZE);
    const gridY = Math.round(pixelY / CELL_SIZE);

    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(gridX, gridColumns - widget.width));
    const clampedY = Math.max(0, Math.min(gridY, gridRows - widget.height));

    onWidgetMove(widgetId, clampedX, clampedY);

    // Reset visual position to snapped grid position
    e.target.x(GRID_PADDING + clampedX * CELL_SIZE + 2);
    e.target.y(GRID_PADDING + clampedY * CELL_SIZE + 2);
  };

  const handleStageClick = (e: any) => {
    // Deselect if clicking on empty space
    if (e.target === e.target.getStage()) {
      onWidgetSelect(null);
    }
  };

  return (
    <div className="bg-black rounded-3xl p-4 shadow-xl inline-block">
      <Stage
        width={stageWidth}
        height={stageHeight}
        onClick={handleStageClick}
        style={{ backgroundColor: LCD_COLORS.background, borderRadius: '8px' }}
      >
        <Layer>
          {/* Grid background */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill={LCD_COLORS.background}
          />

          {/* Grid lines */}
          {Array.from({ length: gridColumns + 1 }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={GRID_PADDING + i * CELL_SIZE}
              y={GRID_PADDING}
              width={1}
              height={gridRows * CELL_SIZE}
              fill={LCD_COLORS.border}
              opacity={0.3}
            />
          ))}
          {Array.from({ length: gridRows + 1 }).map((_, i) => (
            <Rect
              key={`h-${i}`}
              x={GRID_PADDING}
              y={GRID_PADDING + i * CELL_SIZE}
              width={gridColumns * CELL_SIZE}
              height={1}
              fill={LCD_COLORS.border}
              opacity={0.3}
            />
          ))}

          {/* Widgets */}
          {widgets.map((widget) => (
            <WidgetBlock
              key={widget.id}
              widget={widget}
              isSelected={selectedWidgetId === widget.id}
              onSelect={() => onWidgetSelect(widget.id)}
              onDragEnd={(e) => handleDragEnd(widget.id, e)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

interface WidgetBlockProps {
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: any) => void;
}

function WidgetBlock({ widget, isSelected, onSelect, onDragEnd }: WidgetBlockProps) {
  const definition = WIDGET_DEFINITIONS[widget.type];
  const x = GRID_PADDING + widget.x * CELL_SIZE + 2;
  const y = GRID_PADDING + widget.y * CELL_SIZE + 2;
  const width = widget.width * CELL_SIZE - 4;
  const height = widget.height * CELL_SIZE - 4;

  // Sample values for preview
  const sampleValues: Record<string, string> = {
    heart_rate: '142',
    power: '245',
    speed: '28.5',
    cadence: '92',
    time: '1:23:45',
    distance: '42.5',
    elevation: '+380',
    gear: '52x11',
    map_mini: '',
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={onDragEnd}
      onClick={onSelect}
      onTap={onSelect}
    >
      {/* Widget background */}
      <Rect
        width={width}
        height={height}
        fill={isSelected ? '#d8d8d0' : LCD_COLORS.background}
        stroke={isSelected ? LCD_COLORS.text : LCD_COLORS.border}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
      />

      {/* Value */}
      <Text
        text={sampleValues[widget.type] || '---'}
        fontSize={Math.min(height * 0.35, 40)}
        fontFamily="Menlo, Monaco, Consolas, monospace"
        fontStyle="bold"
        fill={LCD_COLORS.text}
        width={width}
        height={height * 0.5}
        align="center"
        verticalAlign="middle"
        y={height * 0.15}
      />

      {/* Unit */}
      {definition.unit && (
        <Text
          text={definition.unit}
          fontSize={14}
          fontFamily="sans-serif"
          fill={LCD_COLORS.textSecondary}
          width={width}
          align="center"
          y={height * 0.55}
        />
      )}

      {/* Label */}
      <Text
        text={definition.label}
        fontSize={12}
        fontFamily="sans-serif"
        fill={LCD_COLORS.textSecondary}
        width={width}
        align="center"
        y={height - 20}
      />
    </Group>
  );
}
