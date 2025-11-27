"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Pre-generate particles with deterministic values
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 1.1) * 4 + 2,
  x: seededRandom(i * 2.2) * 100,
  y: seededRandom(i * 3.3) * 100,
  duration: seededRandom(i * 4.4) * 20 + 10,
  delay: seededRandom(i * 5.5) * 5,
}));

export function LandingHero() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleReveal = () => {
    router.push("/playlist");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(330 81% 60% / 0.4) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
            x: smoothX,
            y: smoothY,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(270 91% 65% / 0.5) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
            x: useTransform(smoothX, (v) => -v * 1.5),
            y: useTransform(smoothY, (v) => -v * 1.5),
          }}
          animate={{
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 gradient-radial-glow" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-6 max-w-3xl mx-auto text-center"
      >
        {/* Animated heart icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="mb-8 inline-block relative"
        >
          {/* Glow ring behind heart */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(330 81% 60% / 0.4) 0%, transparent 70%)",
              filter: "blur(20px)",
              transform: "scale(2.5)",
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [2.5, 3, 2.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart
              className="w-20 h-20 text-pink-400 fill-pink-400 relative z-10 drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
        >
          <span className="gradient-text-primary">Carolina,</span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/90 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium"
          >
            I made you something special.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-neutral-400 mb-14 max-w-xl mx-auto leading-relaxed font-light"
        >
          There&apos;s a little song hidden in here, just for you.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.button
            onClick={handleReveal}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 text-lg font-semibold text-white rounded-full overflow-hidden transition-shadow duration-500"
            style={{
              background: "linear-gradient(135deg, hsl(330 81% 55%) 0%, hsl(270 81% 50%) 100%)",
              boxShadow: isHovered
                ? "0 20px 40px -10px rgba(236, 72, 153, 0.5), 0 0 60px -10px rgba(168, 85, 247, 0.4)"
                : "0 10px 30px -10px rgba(236, 72, 153, 0.3)",
            }}
            aria-label="Reveal the surprise - opens playlist"
          >
            {/* Button shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
              }}
              animate={isHovered ? {
                x: ["-100%", "200%"],
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />

            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              Reveal the surprise
            </span>
          </motion.button>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-12 text-sm text-neutral-500 flex items-center justify-center gap-2"
        >
          Made with
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 inline" />
          </motion.span>
          just for you
        </motion.p>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(240_10%_4%)] to-transparent pointer-events-none" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
