import {
  Widget,
  WIDGET_DEFINITIONS,
  LCD_COLORS,
  getPowerZoneColor,
  getHeartRateZoneColor,
} from '@peloton/shared';

interface WidgetPreviewProps {
  widgets: Widget[];
  gridColumns: number;
  gridRows: number;
  screenWidth: number;
  screenHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

// Sample numeric values for zone calculations
const SAMPLE_NUMERIC: Record<string, number> = {
  power: 245,
  power_3s: 238,
  power_10s: 240,
  power_30s: 235,
  power_avg: 215,
  power_max: 892,
  power_lap: 250,
  power_normalized: 228,
  power_ftp_percent: 82,
  heart_rate: 142,
  heart_rate_avg: 138,
  heart_rate_max: 175,
  speed: 28.5,
  speed_avg: 25.2,
  speed_max: 52.1,
  cadence: 92,
  cadence_avg: 88,
  distance: 42.5,
  elevation: 385,
  elevation_gain: 892,
  grade: 4.2,
  calories: 1245,
  temperature: 22,
  vam: 850,
};

// Sample display values for preview
const SAMPLE_VALUES: Record<string, string> = {
  speed: '28.5',
  speed_avg: '25.2',
  speed_max: '52.1',
  power: '245',
  power_3s: '238',
  power_avg: '215',
  power_max: '892',
  power_zone: 'Z3',
  power_ftp_percent: '82%',
  heart_rate: '142',
  heart_rate_avg: '138',
  heart_rate_max: '175',
  heart_rate_zone: 'Z2',
  cadence: '92',
  cadence_avg: '88',
  distance: '42.5',
  time_elapsed: '1:45:22',
  time_lap: '4:32',
  elevation: '385',
  elevation_gain: '892',
  grade: '4.2',
  gear: '50-17',
  calories: '1,245',
  temperature: '22',
};

// Widget types that support zone coloring
const POWER_ZONE_WIDGETS = [
  'power', 'power_3s', 'power_10s', 'power_30s', 'power_lap',
  'power_zone', 'power_ftp_percent', 'power_normalized',
];
const HR_ZONE_WIDGETS = [
  'heart_rate', 'heart_rate_zone', 'heart_rate_percent_max',
];

// Demo athlete values for preview
const DEMO_FTP = 300;
const DEMO_MAX_HR = 185;

function calculateOptimalFontSize(
  text: string,
  availableWidth: number,
  availableHeight: number,
  preference: 'auto' | 'small' | 'medium' | 'large' = 'auto'
): number {
  const multipliers = { small: 0.6, medium: 0.8, large: 1.0, auto: 1.0 };

  // Height-based constraint (value should use ~40% of widget height)
  const heightBasedSize = availableHeight * 0.4;

  // Width-based constraint (rough estimate based on character count)
  const charWidth = 0.6; // Approximate width ratio for monospace
  const widthBasedSize = (availableWidth * 0.85) / (text.length * charWidth);

  // Use the smaller of the two constraints
  const autoSize = Math.min(heightBasedSize, widthBasedSize);

  // Apply preference multiplier
  const finalSize = autoSize * multipliers[preference];

  // Clamp to reasonable range
  return Math.max(8, Math.min(48, finalSize));
}

function getZoneColor(widget: Widget): string | null {
  const useZoneBackground = widget.config?.zoneColors !== false;
  if (!useZoneBackground) return null;

  if (POWER_ZONE_WIDGETS.includes(widget.type)) {
    const powerValue = SAMPLE_NUMERIC['power'] || 0;
    return getPowerZoneColor(powerValue, DEMO_FTP);
  } else if (HR_ZONE_WIDGETS.includes(widget.type)) {
    const hrValue = SAMPLE_NUMERIC['heart_rate'] || 0;
    return getHeartRateZoneColor(hrValue, DEMO_MAX_HR);
  }
  return null;
}

export function WidgetPreview({
  widgets,
  gridColumns,
  gridRows,
  screenWidth,
  screenHeight,
  safeAreaTop,
  safeAreaBottom,
}: WidgetPreviewProps) {
  const usableHeight = screenHeight - safeAreaTop - safeAreaBottom;
  const cellWidth = screenWidth / gridColumns;
  const cellHeight = usableHeight / gridRows;
  const padding = 2;

  return (
    <div
      className="relative"
      style={{
        width: screenWidth,
        height: screenHeight,
        backgroundColor: LCD_COLORS.background,
        paddingTop: safeAreaTop,
        paddingBottom: safeAreaBottom,
      }}
    >
      {/* Grid overlay (subtle) */}
      <div className="absolute inset-0 pointer-events-none" style={{ top: safeAreaTop, bottom: safeAreaBottom }}>
        {Array.from({ length: gridColumns - 1 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: (i + 1) * cellWidth,
              width: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          />
        ))}
        {Array.from({ length: gridRows - 1 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: (i + 1) * cellHeight,
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          />
        ))}
      </div>

      {/* Widgets */}
      {widgets.map((widget) => {
        const definition = WIDGET_DEFINITIONS[widget.type];
        if (!definition) return null;

        const x = widget.x * cellWidth + padding;
        const y = widget.y * cellHeight + padding;
        const width = widget.width * cellWidth - padding * 2;
        const height = widget.height * cellHeight - padding * 2;

        const value = SAMPLE_VALUES[widget.type] || '---';
        const fontSize = calculateOptimalFontSize(
          value,
          width - 8,
          height - 24,
          widget.config?.fontSizePreference || 'auto'
        );

        const zoneColor = getZoneColor(widget);
        const hasZoneColor = !!zoneColor;
        const textColor = hasZoneColor ? '#ffffff' : LCD_COLORS.text;
        const labelColor = hasZoneColor ? 'rgba(255,255,255,0.8)' : LCD_COLORS.textSecondary;

        return (
          <div
            key={widget.id}
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: x,
              top: y,
              width,
              height,
              backgroundColor: zoneColor || LCD_COLORS.background,
              border: `1px solid ${zoneColor || LCD_COLORS.border}`,
              borderRadius: 4,
            }}
          >
            <span
              className="font-bold font-mono"
              style={{
                fontSize,
                color: textColor,
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span
              className="uppercase tracking-wide"
              style={{
                fontSize: Math.max(6, fontSize * 0.35),
                color: labelColor,
                marginTop: 2,
              }}
            >
              {definition.shortLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
