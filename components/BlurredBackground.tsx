"use client";

interface BlurredBackgroundProps {
  imageSrc: string;
}

export function BlurredBackground({ imageSrc }: BlurredBackgroundProps) {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-110">
          <img
            src={imageSrc}
            alt="Background"
            className="w-full h-full object-cover animate-in fade-in duration-1000"
            style={{
              filter: "blur(80px) brightness(0.4)",
              transform: "scale(1.2)",
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 animate-in fade-in duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, transparent 60%)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
    </>
  );
}
