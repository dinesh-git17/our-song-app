"use client";

import { motion } from "framer-motion";

interface BlurredBackgroundProps {
  imageSrc: string;
  isPlaying?: boolean;
}

export function BlurredBackground({ imageSrc, isPlaying = false }: BlurredBackgroundProps) {
  return (
    <>
      {/* Base blurred image layer */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{
              filter: "blur(100px) brightness(0.35) saturate(1.2)",
              transform: "scale(1.3)",
            }}
          />
        </motion.div>
      </div>

      {/* Animated color accent layer - pulses with music */}
      <motion.div
        className="absolute inset-0"
        animate={isPlaying ? {
          opacity: [0.15, 0.25, 0.15],
        } : {
          opacity: 0.15,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(330 81% 60% / 0.3) 0%, transparent 60%)",
        }}
      />

      {/* Secondary accent for depth */}
      <motion.div
        className="absolute inset-0"
        animate={isPlaying ? {
          opacity: [0.1, 0.2, 0.1],
        } : {
          opacity: 0.1,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 70%, hsl(270 91% 65% / 0.25) 0%, transparent 50%)",
        }}
      />

      {/* Top vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, hsl(240 10% 4% / 0.6) 0%, transparent 30%)",
        }}
      />

      {/* Bottom vignette - stronger for controls visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, hsl(240 10% 4% / 0.9) 0%, hsl(240 10% 4% / 0.5) 25%, transparent 50%)",
        }}
      />

      {/* Noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
