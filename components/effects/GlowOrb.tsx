// components/effects/GlowOrb.tsx
"use client";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  size?: number;
  color?: "violet" | "cyan" | "pink";
  drift?: "a" | "b";
  style?: React.CSSProperties;
}

/**
 * Ambient drifting orb — a soft radial-gradient circle with blur.
 * Uses the orbDriftA / orbDriftB keyframes from tailwind.config.ts.
 */
export function GlowOrb({
  className,
  size = 320,
  color = "violet",
  drift = "a",
  style,
}: GlowOrbProps) {
  const colorMap = {
    violet: "bg-accent-violet/20",
    cyan: "bg-accent-cyan/20",
    pink: "bg-accent-pink/20",
  };
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        colorMap[color],
        drift === "a" ? "animate-orb-drift-a" : "animate-orb-drift-b",
        className
      )}
      style={{ width: size, height: size, ...style }}
    />
  );
}
