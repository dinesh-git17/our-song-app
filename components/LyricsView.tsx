"use client";

import { LyricLine } from "@/data/songs";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface LyricsViewProps {
  currentTime: number;
  lyrics: LyricLine[];
}

export function LyricsView({ currentTime, lyrics }: LyricsViewProps) {
  const getCurrentLyricIndex = (): number => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return -1;
  };

  const currentIndex = getCurrentLyricIndex();

  // Spring animation for smooth scrolling
  const lineHeight = 70;
  const targetOffset = currentIndex >= 0 ? -currentIndex * lineHeight : 0;

  const springOffset = useSpring(targetOffset, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // Move useTransform to component body (not inline in JSX)
  const yOffset = useTransform(springOffset, (v) => v + 100);

  useEffect(() => {
    springOffset.set(targetOffset);
  }, [targetOffset, springOffset]);

  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden relative min-h-[120px]">
      {/* Top fade gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, hsl(240 10% 4% / 0.95) 0%, transparent 100%)",
        }}
      />

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(240 10% 4% / 0.95) 0%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-3xl px-4 sm:px-6 h-full">
        <motion.div
          style={{ y: yOffset }}
          className="flex flex-col"
        >
          {lyrics.map((line, index) => {
            const distanceFromCurrent = index - currentIndex;
            const absDistance = Math.abs(distanceFromCurrent);
            const isCurrent = index === currentIndex;
            const isPast = index < currentIndex;

            // Sophisticated opacity calculation
            let opacity = 0.25;
            if (isCurrent) opacity = 1;
            else if (absDistance === 1) opacity = 0.5;
            else if (absDistance === 2) opacity = 0.35;

            // Scale calculation
            let scale = 0.9;
            if (isCurrent) scale = 1;
            else if (absDistance === 1) scale = 0.95;

            return (
              <motion.div
                key={index}
                animate={{
                  opacity,
                  scale,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center flex items-center justify-center"
                style={{
                  height: `${lineHeight}px`,
                  minHeight: `${lineHeight}px`,
                }}
              >
                <span
                  className={`max-w-full px-2 transition-all duration-300 ${
                    isCurrent
                      ? "text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-white"
                      : isPast
                        ? "text-base sm:text-lg font-medium leading-snug text-neutral-500"
                        : "text-base sm:text-lg font-medium leading-snug text-neutral-400"
                  }`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ...(isCurrent && {
                      background: "linear-gradient(135deg, #ffffff 0%, #f9a8d4 50%, #c4b5fd 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }),
                  }}
                >
                  {line.text}
                </span>
              </motion.div>
            );
          })}

          {/* Spacer at the end for last lyrics to scroll to center */}
          <div style={{ height: "120px" }} />
        </motion.div>
      </div>

      {/* Subtle center line indicator */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 rounded-full opacity-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, hsl(330 81% 60% / 0.3) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
