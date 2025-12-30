interface DynamicIslandProps {
  width?: number;
  height?: number;
  scale?: number;
}

export function DynamicIsland({
  width = 126,
  height = 37,
  scale = 0.5
}: DynamicIslandProps) {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledRadius = (height / 2) * scale;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bg-black z-10"
      style={{
        top: 12 * scale,
        width: scaledWidth,
        height: scaledHeight,
        borderRadius: scaledRadius,
      }}
    >
      {/* Camera lens highlight */}
      <div
        className="absolute bg-gray-800 rounded-full"
        style={{
          width: 10 * scale,
          height: 10 * scale,
          right: 12 * scale,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <div
          className="absolute bg-gray-600 rounded-full"
          style={{
            width: 4 * scale,
            height: 4 * scale,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}
