"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Anime } from "@/lib/types";
import { scoreLabel } from "@/components/format";
import { X, Play, ExternalLink, Star, Calendar, Tv, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { Drawer } from "vaul";

interface AnimeModalProps {
  anime: Anime | null;
  onClose: () => void;
}

export default function AnimeModal({ anime, onClose }: AnimeModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  // Reset expanded state when anime changes
  useEffect(() => {
    setExpanded(false);
  }, [anime]);

  // Entrance / exit animation
  useEffect(() => {
    if (!anime) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const backdrop = backdropRef.current;
    const modal = modalRef.current;

    if (!backdrop || !modal) return;

    if (reduceMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(modal, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(modal, { opacity: 0, scale: 0.9, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: "spring(1, 100, 12, 0)" } });
    tl.to(backdrop, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      .to(modal, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "spring(1, 100, 12, 0)" }, 0.05);

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [anime]);

  const handleClose = useCallback(() => {
    if (!anime) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const backdrop = backdropRef.current;
    const modal = modalRef.current;

    if (reduceMotion || !backdrop || !modal) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });
    tl.to(modal, { opacity: 0, scale: 0.9, y: 30, duration: 0.25, ease: "power2.in" }, 0)
      .to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);

    tlRef.current = tl;
  }, [anime, onClose]);

  // Escape key + scroll lock
  useEffect(() => {
    if (!anime) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [anime, handleClose]);

  if (!anime) return null;

  const trailerUrl = anime.trailerYoutubeId
    ? `https://www.youtube-nocookie.com/embed/${anime.trailerYoutubeId}?rel=0`
    : null;

  const youtubeWatchUrl = anime.trailerYoutubeId
    ? `https://www.youtube.com/watch?v=${anime.trailerYoutubeId}`
    : null;

  const metaItems = [
    anime.score != null && { icon: Star, label: scoreLabel(anime) },
    anime.year != null && { icon: Calendar, label: String(anime.year) },
    anime.episodes != null && { icon: Tv, label: `${anime.episodes} EP` },
  ].filter(Boolean) as { icon: typeof Star; label: string }[];

  const synopsisClamped = !expanded && anime.synopsis.length > 280;
  const synopsisText = synopsisClamped
    ? anime.synopsis.slice(0, 280).trimEnd() + "…"
    : anime.synopsis;

  // --- Shared content (used by both desktop modal and mobile drawer) ---
  const content = (
    <div className="flex flex-col h-full">
      {/* Banner */}
      <div className="relative h-48 md:h-56 flex-shrink-0 overflow-hidden">
        {anime.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.banner}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-soft via-bg-soft/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 hover:bg-black/70"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="relative px-5 md:px-8 pb-8">
          {/* Poster + Info */}
          <div className="flex gap-5">
            {/* Overlapping poster */}
            <div className="flex-shrink-0 -mt-20 md:-mt-24 z-10">
              <div className="w-40 md:w-48 aspect-[2/3] rounded-xl border-2 border-white/20 shadow-glow-violet overflow-hidden bg-bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.cover || "/placeholder.svg"}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-3 md:pt-4">
              <h2 className="font-display text-xl md:text-[1.75rem] font-bold leading-tight text-text pr-8">
                {anime.title}
              </h2>
              {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                <p className="text-sm text-text-muted mt-0.5 truncate">{anime.titleEnglish}</p>
              )}
              {anime.titleRomaji && (
                <p className="text-xs text-text-dim mt-0.5 italic">{anime.titleRomaji}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-text-muted">
                {metaItems.map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <item.icon size={14} className="text-accent-violet" />
                    {item.label}
                  </span>
                ))}
                {anime.scoreSource && (
                  <span className="text-xs text-text-dim">
                    via {anime.scoreSource === "mal" ? "MAL" : "AniList"}
                  </span>
                )}
              </div>

              {/* Genre chips */}
              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {anime.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent-violet/10 text-accent-violet border border-accent-violet/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {youtubeWatchUrl && (
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-violet text-white font-medium text-sm hover:bg-accent-violet/80 transition-colors shadow-glow-violet"
              >
                <Play size={16} />
                Watch on YouTube
              </a>
            )}
            <a
              href={anime.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-transparent text-text-muted font-medium text-sm border border-border hover:border-border-hover hover:text-text transition-colors"
            >
              <ExternalLink size={16} />
              View on {anime.source === "mal" ? "MyAnimeList" : "AniList"}
            </a>
          </div>

          {/* Synopsis */}
          {anime.synopsis && (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-text-muted">
                {synopsisText}
              </p>
              {anime.synopsis.length > 280 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-violet hover:text-accent-violet/80 transition-colors"
                >
                  {expanded ? "Show less" : "Read more"}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          )}

          {/* Trailer */}
          {trailerUrl && (
            <div className="mt-6 aspect-video rounded-xl overflow-hidden border border-border bg-black">
              <iframe
                src={trailerUrl}
                title={`${anime.title} trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Mobile: Vaul Drawer ---
  if (isMobile) {
    return (
      <Drawer.Root open={!!anime} onOpenChange={(o) => !o && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-modal flex flex-col h-[92dvh] rounded-t-2xl bg-bg-soft/95 backdrop-blur-xl border-t border-border"
            aria-describedby={anime.title}
          >
            <div
              className="flex-shrink-0 w-12 h-1.5 rounded-full bg-text-dim/40 mx-auto mt-3 mb-1"
              aria-hidden="true"
            />
            {content}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // --- Desktop: Centered modal ---
  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-modal flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label={anime.title}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-bg-soft/95 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-card-hover"
      >
        {content}
      </div>
    </div>
  );
}
