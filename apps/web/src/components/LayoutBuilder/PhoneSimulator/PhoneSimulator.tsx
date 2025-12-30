import { useState } from 'react';
import { ProfileScreen, DEVICE_FRAME_SPECS, DeviceFrameSpec } from '@peloton/shared';
import { PhoneFrame } from './PhoneFrame';
import { DynamicIsland } from './DynamicIsland';
import { NotchMask } from './NotchMask';
import { ScreenCarousel } from './ScreenCarousel';
import { PageDots } from './PageDots';
import { WidgetPreview } from './WidgetPreview';

interface PhoneSimulatorProps {
  deviceType: string;
  screens: ProfileScreen[];
  scale?: number;
  onScreenSelect?: (index: number) => void;
  selectedScreenIndex?: number;
}

export function PhoneSimulator({
  deviceType,
  screens,
  scale = 0.5,
  onScreenSelect,
  selectedScreenIndex,
}: PhoneSimulatorProps) {
  const [internalIndex, setInternalIndex] = useState(0);

  // Use external control if provided, otherwise internal state
  const currentIndex = selectedScreenIndex ?? internalIndex;
  const handleIndexChange = (index: number) => {
    if (onScreenSelect) {
      onScreenSelect(index);
    } else {
      setInternalIndex(index);
    }
  };

  const spec: DeviceFrameSpec = DEVICE_FRAME_SPECS[deviceType] || DEVICE_FRAME_SPECS.iphone_15;

  const scaledScreenWidth = spec.screenWidth * scale;
  const scaledScreenHeight = spec.screenHeight * scale;

  return (
    <div className="flex flex-col items-center">
      <PhoneFrame spec={spec} scale={scale}>
        {/* Notch or Dynamic Island */}
        {spec.notchType === 'dynamic_island' && (
          <DynamicIsland
            width={spec.notchWidth}
            height={spec.notchHeight}
            scale={scale}
          />
        )}
        {spec.notchType === 'notch' && (
          <NotchMask
            width={spec.notchWidth}
            height={spec.notchHeight}
            screenWidth={spec.screenWidth}
            scale={scale}
          />
        )}

        {/* Screen content with carousel */}
        {screens.length > 0 ? (
          <ScreenCarousel
            screenCount={screens.length}
            currentIndex={currentIndex}
            onIndexChange={handleIndexChange}
            containerWidth={scaledScreenWidth}
            containerHeight={scaledScreenHeight}
          >
            {screens.map((screen) => (
              <WidgetPreview
                key={screen.id}
                widgets={screen.widgets}
                gridColumns={screen.gridColumns}
                gridRows={screen.gridRows}
                screenWidth={scaledScreenWidth}
                screenHeight={scaledScreenHeight}
                safeAreaTop={spec.safeAreaTop * scale}
                safeAreaBottom={spec.safeAreaBottom * scale}
              />
            ))}
          </ScreenCarousel>
        ) : (
          <div
            className="flex items-center justify-center h-full text-gray-500"
            style={{ backgroundColor: '#e5e5e0' }}
          >
            <span className="text-sm">No screens</span>
          </div>
        )}

        {/* Home indicator */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-800 rounded-full"
          style={{
            width: 100 * scale,
            height: 4 * scale,
            bottom: 8 * scale,
          }}
        />
      </PhoneFrame>

      {/* Page dots below phone */}
      <PageDots
        total={screens.length}
        current={currentIndex}
        onDotClick={handleIndexChange}
      />

      {/* Screen name */}
      {screens[currentIndex] && (
        <div className="text-sm text-gray-600 mt-1">
          {screens[currentIndex].name}
        </div>
      )}
    </div>
  );
}
