interface NotchMaskProps {
  width?: number;
  height?: number;
  scale?: number;
  screenWidth: number;
}

export function NotchMask({
  width = 162,
  height = 34,
  scale = 0.5,
  screenWidth
}: NotchMaskProps) {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledScreenWidth = screenWidth * scale;
  const earWidth = (scaledScreenWidth - scaledWidth) / 2;
  const curveRadius = 8 * scale;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex">
      {/* Left ear (status bar area) */}
      <div
        className="bg-black"
        style={{
          width: earWidth,
          height: scaledHeight,
          borderBottomRightRadius: curveRadius,
        }}
      />

      {/* Notch */}
      <div className="relative" style={{ width: scaledWidth }}>
        <svg
          width={scaledWidth}
          height={scaledHeight}
          viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
          className="absolute top-0"
        >
          {/* Notch shape with curved edges */}
          <path
            d={`
              M 0 0
              L 0 ${scaledHeight * 0.3}
              Q 0 ${scaledHeight} ${curveRadius * 2} ${scaledHeight}
              L ${scaledWidth - curveRadius * 2} ${scaledHeight}
              Q ${scaledWidth} ${scaledHeight} ${scaledWidth} ${scaledHeight * 0.3}
              L ${scaledWidth} 0
              Z
            `}
            fill="black"
          />
        </svg>

        {/* Speaker grille */}
        <div
          className="absolute bg-gray-800 rounded-full"
          style={{
            width: 40 * scale,
            height: 4 * scale,
            left: '50%',
            top: '40%',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Camera */}
        <div
          className="absolute bg-gray-700 rounded-full"
          style={{
            width: 8 * scale,
            height: 8 * scale,
            right: 20 * scale,
            top: '35%',
          }}
        />
      </div>

      {/* Right ear (status bar area) */}
      <div
        className="bg-black"
        style={{
          width: earWidth,
          height: scaledHeight,
          borderBottomLeftRadius: curveRadius,
        }}
      />
    </div>
  );
}
