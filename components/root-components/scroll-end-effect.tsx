"use client";

import { useRef, useState } from "react";

export default function ScrollEndBubble({
  children,
}: {
  children: React.ReactNode;
}) {
  const startY = useRef(0);
  const [stretch, setStretch] = useState(0);
  const isTouching = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isTouching.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current) return;

    const touchY = e.touches[0].clientY;
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const atBottom = scrollTop + viewportHeight >= fullHeight - 1;

    if (atBottom) {
      const delta = touchY - startY.current;
      if (delta < 0) return; // only stretch when pulling up past bottom
      setStretch(delta / 2); // scale down for smoothness
    }
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    setStretch(0); // snap back
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {children}

      {/* Stretching Bubble */}
      <div
        style={{
          transform: `scaleY(${1 + stretch / 60})`,
        }}
        className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 h-4 w-16 bg-blue-400 rounded-full transition-transform duration-150"
      />
    </div>
  );
}
