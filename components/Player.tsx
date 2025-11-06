"use client";

import { SONG_METADATA } from "@/data/lyrics";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BlurredBackground } from "./BlurredBackground";
import { LyricsView } from "./LyricsView";

export function Player() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(SONG_METADATA.duration);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeat]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 5);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <BlurredBackground imageSrc="/cover.png" />

      <audio ref={audioRef} src="/song.mp3" preload="metadata" />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 pt-4 px-4">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="flex-shrink-0 pt-2 pb-4 px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isPlaying ? [1, 1.03, 1] : 1,
              opacity: 1,
            }}
            transition={{
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.5,
              },
            }}
            className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-4"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
              <img
                src="/cover.png"
                alt="Album Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold mb-1"
            style={{
              background:
                "linear-gradient(135deg, #fbb6ce 0%, #d8b4fe 50%, #c7d2fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            {SONG_METADATA.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base md:text-lg text-gray-300 font-medium tracking-wide"
          >
            {SONG_METADATA.artist}
          </motion.p>
        </div>

        <LyricsView currentTime={currentTime} />

        <div className="flex-shrink-0 safe-bottom">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="px-6 pb-4 space-y-3 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-xl"
          >
            <div className="space-y-2 pt-4">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${progressPercentage}%, rgba(255,255,255,0.2) ${progressPercentage}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />

              <div className="flex justify-between text-xs text-gray-300 font-semibold tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pb-2">
              <motion.button
                onClick={toggleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${
                  isLiked
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/50"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${isLiked ? "fill-white" : ""}`}
                />
              </motion.button>

              <motion.button
                onClick={skipBackward}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={togglePlayPause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-2xl shadow-white/30"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? "playing" : "paused"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-gray-900 fill-gray-900" />
                    ) : (
                      <Play className="w-7 h-7 text-gray-900 fill-gray-900 ml-1" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={skipForward}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={toggleRepeat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${
                  isRepeat
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/50"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Repeat className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
