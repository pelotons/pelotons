import { ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface ScreenCarouselProps {
  screenCount: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  containerWidth: number;
  containerHeight: number;
  children: ReactNode[];
}

export function ScreenCarousel({
  screenCount,
  currentIndex,
  onIndexChange,
  containerWidth,
  containerHeight,
  children,
}: ScreenCarouselProps) {
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = containerWidth * 0.2;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      // Swipe left - go to next screen
      if (currentIndex < screenCount - 1) {
        onIndexChange(currentIndex + 1);
      }
    } else if (offset > threshold || velocity > 500) {
      // Swipe right - go to previous screen
      if (currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
    }
  };

  return (
    <div
      className="overflow-hidden"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <motion.div
        className="flex h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: -currentIndex * containerWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ cursor: screenCount > 1 ? 'grab' : 'default' }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: containerWidth, height: containerHeight }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
