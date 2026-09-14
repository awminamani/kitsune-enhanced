// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names without conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** "8.7" for MAL, "87%" for AniList. */
export function scoreLabel(score?: number, scoreSource?: "anilist" | "mal"): string {
  if (score == null) return "—";
  return scoreSource === "mal" ? score.toFixed(2).replace(/\.?0+$/, "") : `${score}%`;
}

/** "2024 · 24 EP" style meta line. */
export function metaLine(anime: {
  year?: number;
  episodes?: number;
  format?: string;
}): string {
  const parts: string[] = [];
  if (anime.year) parts.push(String(anime.year));
  if (anime.format) parts.push(anime.format);
  if (anime.episodes) parts.push(`${anime.episodes} EP`);
  return parts.join(" · ");
}

/** Clamp a value between min and max. */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Throttle a function to once per wait-ms. */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  wait: number
): T {
  let last = 0;
  return ((...args: never[]) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  }) as T;
}

/** Prefers reduced motion? */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointer (touch)? */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
