"use client";

import { LYRICS } from "@/data/lyrics";
import { motion } from "framer-motion";

interface LyricsViewProps {
  currentTime: number;
}

export function LyricsView({ currentTime }: LyricsViewProps) {
  const getCurrentLyricIndex = (): number => {
    for (let i = LYRICS.length - 1; i >= 0; i--) {
      if (currentTime >= LYRICS[i].time) {
        return i;
      }
    }
    return -1;
  };

  const currentIndex = getCurrentLyricIndex();

  const lineHeight = 100;
  const offset = currentIndex >= 0 ? -currentIndex * lineHeight : 0;

  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden">
      <div
        className="relative w-full max-w-2xl px-6"
        style={{ height: "300px" }}
      >
        <motion.div
          animate={{ y: offset + 150 }}
          transition={{
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="flex flex-col"
        >
          {LYRICS.map((line, index) => {
            const distanceFromCurrent = Math.abs(index - currentIndex);
            const isCurrent = index === currentIndex;

            let opacity = 0.2;
            if (isCurrent) opacity = 1;
            else if (distanceFromCurrent === 1) opacity = 0.4;
            else if (distanceFromCurrent === 2) opacity = 0.25;

            return (
              <motion.div
                key={index}
                animate={{
                  opacity,
                  scale: isCurrent ? 1 : 0.92,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center flex items-center justify-center"
                style={{
                  height: `${lineHeight}px`,
                  minHeight: `${lineHeight}px`,
                }}
              >
                <span
                  className={`${
                    isCurrent
                      ? "text-3xl md:text-5xl font-bold text-white leading-tight"
                      : "text-xl md:text-2xl font-medium text-gray-400 leading-tight"
                  } max-w-full px-4`}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {line.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
