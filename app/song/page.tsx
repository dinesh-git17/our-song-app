"use client";

import { Player } from "@/components/Player";
import { getSongById, SONGS } from "@/data/songs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

function SongContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const songId = searchParams.get("id");
  const song = songId ? getSongById(songId) : SONGS[0];

  useEffect(() => {
    if (!song) {
      router.push("/playlist");
    } else {
      setIsLoading(false);
    }
  }, [song, router]);

  if (isLoading || !song) {
    return (
      <div className="fixed inset-0 flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return <Player song={song} />;
}

export default function SongPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center gradient-bg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <SongContent />
    </Suspense>
  );
}
