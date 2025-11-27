"use client";

import { Song } from "@/data/songs";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loadSong: (song: Song) => void;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  stopSong: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Create audio element on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Load a song without playing (for initial page load)
  const loadSong = useCallback((song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only load if it's a different song
    if (!currentSong || currentSong.id !== song.id) {
      // Pause current audio first to prevent conflicts
      audio.pause();

      // Reset state
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      // Load new song
      audio.src = song.audioSrc;
      audio.load();
      setCurrentSong(song);
    }
  }, [currentSong]);

  // Load and play a song (requires user interaction)
  const playSong = useCallback((song: Song) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If it's a different song, load it first
    if (!currentSong || currentSong.id !== song.id) {
      // Pause current audio first to prevent conflicts
      audio.pause();

      // Reset state
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      // Load new song
      audio.src = song.audioSrc;
      audio.load();
      setCurrentSong(song);
    }

    // Play with error handling
    audio.play().catch((error) => {
      // Ignore AbortError and NotAllowedError
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
        console.error("Audio playback error:", error);
      }
    });
  }, [currentSong]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Audio playback error:", error);
        }
      });
    }
  }, [isPlaying, currentSong]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const stopSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        loadSong,
        playSong,
        togglePlayPause,
        seek,
        stopSong,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
