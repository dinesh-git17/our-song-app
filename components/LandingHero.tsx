"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

// Seeded random for consistent particle positions
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Rising particles - gentle magical dust
const RISING_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 1.1) * 3 + 1.5,
  x: seededRandom(i * 2.2) * 100,
  duration: seededRandom(i * 3.3) * 18 + 22,
  delay: seededRandom(i * 4.4) * 12,
  opacity: seededRandom(i * 5.5) * 0.25 + 0.1,
}));

// Bokeh circles for depth - deeper, richer colors
const BOKEH_CIRCLES = [
  { size: 350, x: "10%", y: "15%", color: "hsl(320 55% 40%)", delay: 0 },
  { size: 280, x: "80%", y: "10%", color: "hsl(280 50% 35%)", delay: 2 },
  { size: 320, x: "85%", y: "65%", color: "hsl(340 50% 45%)", delay: 4 },
  { size: 250, x: "5%", y: "70%", color: "hsl(290 45% 38%)", delay: 1 },
  { size: 200, x: "45%", y: "80%", color: "hsl(30 70% 45%)", delay: 3 },
  { size: 180, x: "55%", y: "25%", color: "hsl(310 40% 42%)", delay: 5 },
];

// Floating heart particles that respond to cursor
const FLOATING_HEARTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 6.6) * 8 + 6,
  x: seededRandom(i * 7.7) * 80 + 10,
  y: seededRandom(i * 8.8) * 80 + 10,
  duration: seededRandom(i * 9.9) * 8 + 12,
  delay: seededRandom(i * 10.1) * 5,
}));

// Word animation variants with glow
const wordVariants = {
  hidden: { opacity: 0, y: 25, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.9 + i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Ripple effect interface
interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function LandingHero() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 25, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 25, damping: 18 });

  // Cursor position for floating hearts
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { stiffness: 50, damping: 30 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 25);
      mouseY.set((clientY - innerHeight / 2) / 25);
      cursorX.set(clientX);
      cursorY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY, cursorX, cursorY]);

  // Ripple effect on button click
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const handleReveal = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    setTimeout(() => router.push("/playlist"), 300);
  };

  // Split text for word-by-word animation
  const subtitleWords = "I made you".split(" ");

  return (
    <div
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden gradient-animated vignette"
    >
      {/* Cinematic entrance overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
        style={{
          background: "linear-gradient(135deg, hsl(280 50% 15% / 0.8) 0%, hsl(320 40% 10% / 0.6) 100%)",
        }}
      />

      {/* Rose sweep overlay on load */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(340 60% 50% / 0.15) 50%, transparent 100%)",
          width: "50%",
        }}
      />

      {/* Enhanced bokeh background circles */}
      <div className="absolute inset-0 overflow-hidden">
        {BOKEH_CIRCLES.map((circle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: circle.size,
              height: circle.size,
              left: circle.x,
              top: circle.y,
              background: `radial-gradient(circle, ${circle.color} 0%, transparent 65%)`,
              filter: "blur(50px)",
              x: useTransform(smoothX, (v) => v * (i % 2 === 0 ? 1.2 : -0.8)),
              y: useTransform(smoothY, (v) => v * (i % 2 === 0 ? -0.8 : 1.2)),
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: circle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating heart orb - larger and more prominent */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-float-orb"
        style={{
          background: "radial-gradient(circle, hsl(340 65% 55% / 0.15) 0%, hsl(320 50% 40% / 0.08) 40%, transparent 65%)",
          left: "25%",
          top: "35%",
          filter: "blur(80px)",
        }}
      />

      {/* Secondary warm orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(35 80% 60% / 0.1) 0%, transparent 60%)",
          right: "20%",
          top: "25%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating hearts that follow cursor slightly */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_HEARTS.map((heart, i) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              x: useTransform(smoothCursorX, (v) => (v - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.02 * (i % 2 === 0 ? 1 : -1)),
              y: useTransform(smoothCursorY, (v) => (v - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.02 * (i % 2 === 0 ? -1 : 1)),
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "easeInOut",
            }}
          >
            <Heart
              className="text-rose-400/30 fill-rose-400/20"
              style={{ width: heart.size, height: heart.size }}
              strokeWidth={1}
            />
          </motion.div>
        ))}
      </div>

      {/* Rising magical particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {RISING_PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              bottom: "-30px",
              background: `radial-gradient(circle, hsl(340 65% 75%) 0%, hsl(330 55% 65%) 100%)`,
              boxShadow: "0 0 8px hsl(340 65% 65% / 0.6)",
            }}
            animate={{
              y: [0, "-110vh"],
              opacity: [0, particle.opacity, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Radial glow from top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% -15%, hsl(340 55% 45% / 0.25) 0%, transparent 55%)",
        }}
      />

      {/* Main content - Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 1.2,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 mx-4 sm:mx-8"
      >
        <div className="glass-romantic rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 max-w-xl mx-auto text-center shadow-float">
          {/* Animated heart with heartbeat and sparkles */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 120,
              damping: 10,
            }}
            className="mb-6 inline-block relative sparkle-container"
          >
            {/* Sparkle dots around heart */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="sparkle-dot"
                style={{
                  top: i === 0 ? "-8px" : i === 2 ? "100%" : "50%",
                  left: i === 1 ? "-8px" : i === 3 ? "100%" : "50%",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5 + 1,
                }}
              />
            ))}

            {/* Pulsing glow behind heart */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(340 70% 55% / 0.7) 0%, transparent 65%)",
                filter: "blur(30px)",
                transform: "scale(3.5)",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [3, 4, 3],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div className="animate-heartbeat">
              <Heart
                className="w-14 h-14 sm:w-16 sm:h-16 text-rose-400 fill-rose-400 relative z-10 heart-elegant"
                strokeWidth={0.8}
              />
            </motion.div>
          </motion.div>

          {/* Main heading - "Carolina," with glow reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
            animate={isLoaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2"
          >
            <motion.span
              className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight gradient-text-primary inline-block"
              style={{ letterSpacing: "-0.03em" }}
              animate={isLoaded ? {
                textShadow: [
                  "0 0 0 transparent",
                  "0 0 30px hsl(340 70% 60% / 0.5), 0 0 60px hsl(330 60% 50% / 0.3)",
                  "0 0 15px hsl(340 70% 60% / 0.3), 0 0 30px hsl(330 60% 50% / 0.15)",
                ],
              } : {}}
              transition={{ delay: 1.2, duration: 1.5 }}
            >
              Carolina,
            </motion.span>
          </motion.h1>

          {/* Subtitle - word by word animation */}
          <div className="mb-1">
            {subtitleWords.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={wordVariants}
                className="inline-block text-romantic-light text-2xl sm:text-3xl md:text-4xl font-light mr-3"
                style={{ fontFamily: "var(--font-sans)", color: "hsl(30 25% 90%)" }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* "something special" with handwritten underline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mb-6"
          >
            <span
              className="underline-handwritten text-2xl sm:text-3xl md:text-4xl font-light"
              style={{ color: "hsl(30 25% 90%)" }}
            >
              something special
            </span>
            {/* Sparkle after period */}
            <motion.span
              className="inline-block ml-3"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={isLoaded ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ delay: 2, duration: 0.5, type: "spring" }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-rose-300" />
            </motion.span>
          </motion.div>

          {/* Secondary text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg mb-8 max-w-sm mx-auto leading-relaxed font-light"
            style={{ color: "hsl(280 15% 65%)" }}
          >
            A little song hidden in here, just for you.
          </motion.p>

          {/* Premium CTA Button with ripple */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <motion.button
              ref={buttonRef}
              onClick={handleReveal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base font-medium rounded-full overflow-hidden btn-romantic animate-romantic-pulse"
              style={{ color: "hsl(30 25% 95%)" }}
              aria-label="Open your surprise - reveals a special playlist made just for you"
              role="button"
            >
              {/* Ripple effects */}
              <AnimatePresence>
                {ripples.map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 20,
                      height: 20,
                      marginLeft: -10,
                      marginTop: -10,
                    }}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ))}
              </AnimatePresence>

              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                }}
                animate={isHovered ? { x: ["-100%", "200%"] } : {}}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                }}
              />

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                <motion.span
                  animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
                <span>Open Your Surprise</span>
                <motion.span
                  animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Emotional footer below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-6 text-center"
        >
          <p
            className="text-xs flex items-center justify-center gap-2"
            style={{ color: "hsl(280 12% 55%)" }}
          >
            Made with love
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
            </motion.span>
            Only for you, Carolina.
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ delay: 2.5, duration: 1 }}
            className="signature-flourish text-sm mt-2"
            style={{ color: "hsl(280 15% 50%)" }}
          >
            — Dinn
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(270 40% 4%) 0%, transparent 100%)",
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
