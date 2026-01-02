/**
 * Priority Layout Simulator
 *
 * Renders the priority-based layout within a phone frame.
 * Shows slots of different sizes based on the selected preset.
 */

import { useCallback, useEffect } from 'react';
import {
  DEVICE_PRESETS,
  WIDGET_DEFINITIONS,
  LCD_COLORS,
  type LayoutPreset,
  type SlotAssignment,
  type SlotDefinition,
  getFontSizeMultiplier,
} from '@peloton/shared';

interface PriorityLayoutSimulatorProps {
  deviceType: string;
  preset: LayoutPreset | null;
  slotAssignments: SlotAssignment[];
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string | null) => void;
  onRemoveAssignment: (slotId: string) => void;
  scale?: number;
}

// Phone frame dimensions (same as InteractivePhoneSimulator)
const PHONE_FRAMES: Record<string, {
  frameWidth: number;
  frameHeight: number;
  screenInset: { top: number; bottom: number; left: number; right: number };
  cornerRadius: number;
  notchType: 'none' | 'notch' | 'dynamic_island';
  notchWidth?: number;
  notchHeight?: number;
  bezelColor: string;
  frameColor: string;
}> = {
  iphone_se: {
    frameWidth: 67,
    frameHeight: 138,
    screenInset: { top: 20, bottom: 20, left: 4, right: 4 },
    cornerRadius: 10,
    notchType: 'none',
    bezelColor: '#1a1a1a',
    frameColor: '#2d2d2d',
  },
  iphone_14: {
    frameWidth: 71,
    frameHeight: 146,
    screenInset: { top: 4, bottom: 4, left: 4, right: 4 },
    cornerRadius: 20,
    notchType: 'notch',
    notchWidth: 35,
    notchHeight: 7,
    bezelColor: '#1a1a1a',
    frameColor: '#2d2d2d',
  },
  iphone_15: {
    frameWidth: 71,
    frameHeight: 147,
    screenInset: { top: 4, bottom: 4, left: 4, right: 4 },
    cornerRadius: 22,
    notchType: 'dynamic_island',
    notchWidth: 25,
    notchHeight: 8,
    bezelColor: '#1a1a1a',
    frameColor: '#3d3d3d',
  },
  iphone_15_pro_max: {
    frameWidth: 77,
    frameHeight: 158,
    screenInset: { top: 4, bottom: 4, left: 4, right: 4 },
    cornerRadius: 24,
    notchType: 'dynamic_island',
    notchWidth: 28,
    notchHeight: 9,
    bezelColor: '#1a1a1a',
    frameColor: '#4a4a52',
  },
  iphone_16: {
    frameWidth: 71,
    frameHeight: 147,
    screenInset: { top: 4, bottom: 4, left: 4, right: 4 },
    cornerRadius: 22,
    notchType: 'dynamic_island',
    notchWidth: 25,
    notchHeight: 8,
    bezelColor: '#1a1a1a',
    frameColor: '#2d2d2d',
  },
  iphone_16_pro_max: {
    frameWidth: 78,
    frameHeight: 162,
    screenInset: { top: 4, bottom: 4, left: 4, right: 4 },
    cornerRadius: 24,
    notchType: 'dynamic_island',
    notchWidth: 28,
    notchHeight: 9,
    bezelColor: '#1a1a1a',
    frameColor: '#4a4a52',
  },
};

// Sample values for widget preview
const SAMPLE_VALUES: Record<string, string> = {
  speed: '28.5', speed_avg: '27.8', speed_max: '52.3', speed_lap: '29.1', speed_3s: '28.2',
  pace: '2:06', pace_avg: '2:09',
  power: '245', power_3s: '248', power_10s: '242', power_30s: '238', power_avg: '235',
  power_max: '892', power_lap: '251', power_normalized: '248', power_per_kg: '3.5',
  power_ftp_percent: '88', power_zone: 'Z3', power_if: '0.92', power_balance: '51/49',
  heart_rate: '142', heart_rate_avg: '138', heart_rate_max: '172', heart_rate_lap: '145',
  heart_rate_zone: 'Z3', heart_rate_percent_max: '78',
  cadence: '92', cadence_avg: '89', cadence_max: '112',
  distance: '42.5', distance_lap: '2.3', distance_remaining: '18.2',
  time_elapsed: '1:23:45', time_lap: '4:32', time_of_day: '14:32', time_eta: '16:45',
  elevation: '380', elevation_gain: '+1,240', grade: '4.2', vam: '892',
  calories: '847', tss: '78', battery_level: '87',
};

export function PriorityLayoutSimulator({
  deviceType,
  preset,
  slotAssignments,
  selectedSlotId,
  onSlotSelect,
  onRemoveAssignment,
  scale = 4,
}: PriorityLayoutSimulatorProps) {
  const device = DEVICE_PRESETS[deviceType];
  const frame = PHONE_FRAMES[deviceType] || PHONE_FRAMES.iphone_15;

  const screenWidth = frame.frameWidth - frame.screenInset.left - frame.screenInset.right;
  const screenHeight = frame.frameHeight - frame.screenInset.top - frame.screenInset.bottom;

  // Handle keyboard delete
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSlotId) {
      e.preventDefault();
      onRemoveAssignment(selectedSlotId);
    }
    if (e.key === 'Escape') {
      onSlotSelect(null);
    }
  }, [selectedSlotId, onRemoveAssignment, onSlotSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Calculate available area
  const padding = 4 * scale;
  const statusBarHeight = 15 * scale;
  const availableWidth = screenWidth * scale - padding * 2;
  const availableHeight = screenHeight * scale - padding * 2 - statusBarHeight;

  // Get assignment for a slot
  const getSlotAssignment = (slotId: string) => {
    return slotAssignments.find((a) => a.slotId === slotId);
  };

  // Render slots grouped by row
  const renderSlots = () => {
    if (!preset) {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: statusBarHeight }}>
          <div className="text-center" style={{ color: LCD_COLORS.textSecondary }}>
            <svg
              className="mx-auto mb-2"
              style={{ width: 24 * scale, height: 24 * scale }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
            </svg>
            <p style={{ fontSize: 8 * scale }}>Select a preset from sidebar</p>
          </div>
        </div>
      );
    }

    // Group slots by row
    const rows: Record<number, SlotDefinition[]> = {};
    preset.slots.forEach((slot) => {
      if (!rows[slot.row]) rows[slot.row] = [];
      rows[slot.row].push(slot);
    });

    // Sort rows and slots within rows
    const sortedRows = Object.entries(rows)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([_, slots]) => slots.sort((a, b) => a.col - b.col));

    let yOffset = 0;

    return sortedRows.map((rowSlots, rowIndex) => {
      const rowHeight = (rowSlots[0].heightPercent / 100) * availableHeight;
      const rowY = yOffset;
      yOffset += rowHeight;

      return (
        <div
          key={rowIndex}
          className="absolute flex"
          style={{
            top: statusBarHeight + padding + rowY,
            left: padding,
            width: availableWidth,
            height: rowHeight,
            gap: 2,
          }}
        >
          {rowSlots.map((slot) => {
            const slotWidth = (slot.widthPercent / 100) * availableWidth - 2;
            const assignment = getSlotAssignment(slot.id);
            const isSelected = selectedSlotId === slot.id;

            return (
              <SlotRenderer
                key={slot.id}
                slot={slot}
                assignment={assignment}
                isSelected={isSelected}
                width={slotWidth}
                height={rowHeight - 2}
                scale={scale}
                onClick={() => onSlotSelect(slot.id)}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Device name */}
      <div className="text-sm font-medium text-gray-600 mb-4">
        {device?.name || 'Unknown Device'}
      </div>

      {/* Phone frame */}
      <div
        className="relative select-none"
        style={{
          width: frame.frameWidth * scale,
          height: frame.frameHeight * scale,
        }}
      >
        {/* Outer frame */}
        <div
          className="absolute inset-0 shadow-2xl"
          style={{
            backgroundColor: frame.frameColor,
            borderRadius: frame.cornerRadius * scale,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.3)
            `,
          }}
        />

        {/* Inner bezel */}
        <div
          className="absolute"
          style={{
            top: 2 * scale,
            left: 2 * scale,
            right: 2 * scale,
            bottom: 2 * scale,
            backgroundColor: frame.bezelColor,
            borderRadius: (frame.cornerRadius - 2) * scale,
          }}
        />

        {/* Screen area */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: frame.screenInset.top * scale,
            left: frame.screenInset.left * scale,
            width: screenWidth * scale,
            height: screenHeight * scale,
            borderRadius: (frame.cornerRadius - 4) * scale,
            backgroundColor: LCD_COLORS.background,
          }}
          onClick={() => onSlotSelect(null)}
        >
          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 z-10"
            style={{ height: 12 * scale, backgroundColor: LCD_COLORS.background }}
          >
            <span style={{ fontSize: 7 * scale, color: LCD_COLORS.text }}>9:41</span>
            <div
              className="rounded-sm"
              style={{
                width: 14 * scale,
                height: 7 * scale,
                backgroundColor: LCD_COLORS.text,
                opacity: 0.6,
              }}
            />
          </div>

          {/* Dynamic Island */}
          {frame.notchType === 'dynamic_island' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black z-20"
              style={{
                top: 3 * scale,
                width: (frame.notchWidth || 25) * scale,
                height: (frame.notchHeight || 8) * scale,
                borderRadius: 10 * scale,
              }}
            />
          )}

          {/* Slots */}
          {renderSlots()}
        </div>

        {/* Side buttons */}
        <div
          className="absolute bg-gray-600 rounded-sm"
          style={{ right: -2 * scale, top: 30 * scale, width: 2 * scale, height: 12 * scale }}
        />
        <div
          className="absolute bg-gray-600 rounded-sm"
          style={{ left: -2 * scale, top: 25 * scale, width: 2 * scale, height: 8 * scale }}
        />
        <div
          className="absolute bg-gray-600 rounded-sm"
          style={{ left: -2 * scale, top: 38 * scale, width: 2 * scale, height: 14 * scale }}
        />
      </div>
    </div>
  );
}

// Individual slot renderer
function SlotRenderer({
  slot,
  assignment,
  isSelected,
  width,
  height,
  scale,
  onClick,
}: {
  slot: SlotDefinition;
  assignment: SlotAssignment | undefined;
  isSelected: boolean;
  width: number;
  height: number;
  scale: number;
  onClick: () => void;
}) {
  const fontMultiplier = getFontSizeMultiplier(slot.sizeClass);
  const baseFontSize = Math.min(height * 0.4, width * 0.25);
  const valueFontSize = Math.max(baseFontSize * fontMultiplier, 10 * scale);
  const labelFontSize = Math.max(6 * scale, 8);
  const unitFontSize = Math.max(5 * scale, 6);

  const widgetDef = assignment ? WIDGET_DEFINITIONS[assignment.widgetType] : null;
  const value = assignment ? (SAMPLE_VALUES[assignment.widgetType] || '---') : null;
  const label = widgetDef?.shortLabel || widgetDef?.label || '';
  const unit = widgetDef?.unit || '';

  const showUnit = height > 25 * scale && unit;
  const showLabel = height > 30 * scale;

  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-2 hover:ring-blue-300'
      }`}
      style={{
        width,
        height,
        backgroundColor: isSelected ? '#e0f2fe' : LCD_COLORS.background,
        border: `1px solid ${isSelected ? '#3b82f6' : LCD_COLORS.border}`,
        borderRadius: 3,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {assignment && widgetDef ? (
        <>
          {/* Value */}
          <span
            className="font-bold font-mono leading-none"
            style={{
              fontSize: valueFontSize,
              color: LCD_COLORS.text,
            }}
          >
            {value}
          </span>

          {/* Unit */}
          {showUnit && (
            <span
              className="leading-none"
              style={{
                fontSize: unitFontSize,
                color: LCD_COLORS.textSecondary,
                marginTop: 2,
              }}
            >
              {unit}
            </span>
          )}

          {/* Label */}
          {showLabel && (
            <span
              className="absolute bottom-0 left-0 right-0 text-center leading-none overflow-hidden whitespace-nowrap"
              style={{
                fontSize: labelFontSize,
                color: LCD_COLORS.textSecondary,
                paddingBottom: 2,
              }}
            >
              {label}
            </span>
          )}
        </>
      ) : (
        // Empty slot placeholder
        <div className="text-center">
          <div
            className="font-medium"
            style={{
              fontSize: Math.max(valueFontSize * 0.6, 10),
              color: LCD_COLORS.textSecondary,
            }}
          >
            {slot.priority}
          </div>
          <div
            style={{
              fontSize: Math.max(labelFontSize * 0.9, 8),
              color: LCD_COLORS.textSecondary,
              opacity: 0.6,
            }}
          >
            {slot.sizeClass}
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute -top-1 -right-1 bg-blue-500 rounded-full flex items-center justify-center"
          style={{ width: 12, height: 12 }}
        >
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
