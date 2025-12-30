import React from 'react';
import { DeviceFrameSpec } from '@peloton/shared';

interface PhoneFrameProps {
  spec: DeviceFrameSpec;
  scale?: number;
  children: React.ReactNode;
}

export function PhoneFrame({ spec, scale = 0.5, children }: PhoneFrameProps) {
  const scaledWidth = spec.frameWidth * scale;
  const scaledHeight = spec.frameHeight * scale;
  const scaledScreenWidth = spec.screenWidth * scale;
  const scaledScreenHeight = spec.screenHeight * scale;
  const scaledBezel = spec.bezelWidth * scale;
  const scaledFrameRadius = spec.frameCornerRadius * scale;
  const scaledScreenRadius = spec.screenCornerRadius * scale;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: scaledWidth,
        height: scaledHeight,
      }}
    >
      {/* Phone frame (outer shell) */}
      <div
        className="absolute inset-0 bg-gray-900 shadow-2xl"
        style={{
          borderRadius: scaledFrameRadius,
          // Subtle metallic edge effect
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.1) inset,
            0 25px 50px -12px rgba(0,0,0,0.5),
            0 0 0 1px rgba(0,0,0,0.3)
          `,
        }}
      />

      {/* Side buttons - volume */}
      <div
        className="absolute bg-gray-800"
        style={{
          left: -3,
          top: scaledHeight * 0.2,
          width: 3,
          height: 30 * scale,
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        className="absolute bg-gray-800"
        style={{
          left: -3,
          top: scaledHeight * 0.2 + 40 * scale,
          width: 3,
          height: 30 * scale,
          borderRadius: '2px 0 0 2px',
        }}
      />

      {/* Side button - power */}
      <div
        className="absolute bg-gray-800"
        style={{
          right: -3,
          top: scaledHeight * 0.25,
          width: 3,
          height: 50 * scale,
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Screen area */}
      <div
        className="absolute bg-black overflow-hidden"
        style={{
          width: scaledScreenWidth,
          height: scaledScreenHeight,
          borderRadius: scaledScreenRadius,
          top: scaledBezel,
          left: scaledBezel,
        }}
      >
        {children}
      </div>
    </div>
  );
}
