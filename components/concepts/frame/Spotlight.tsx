"use client";

type Props = { x?: string; y?: string; size?: string; strength?: number; className?: string };

/** TURA-style soft spotlight: a warm radial glow behind the focal point (screen-blended over the canvas). */
export function Spotlight({ x = "50%", y = "38%", size = "62vmax", strength = 0.16, className = "" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 mix-blend-screen ${className}`}
      style={{
        background: `radial-gradient(${size} ${size} at ${x} ${y}, rgb(232 201 138 / ${strength}) 0%, rgb(201 164 92 / ${strength * 0.45}) 28%, transparent 62%)`,
      }}
    />
  );
}
