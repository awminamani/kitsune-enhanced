// components/anime/AnimeHero.tsx
"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Anime } from "@/lib/types";
import { cn, prefersReducedMotion, scoreLabel, isCoarsePointer } from "@/lib/utils";
import { GlowOrb } from "@/components/effects";
import { Magnetic } from "@/components/motion/Magnetic";
import { PlayIcon, StarIcon } from "@/components/icons";

interface AnimeHeroProps {
  anime: Anime;
  items?: Anime[];
  activeIndex?: number;
  onDotClick?: (i: number) => void;
}

function heroBg(anime: Anime): string {
  return anime.banner || anime.cover || "/placeholder.svg";
}

function TitleWords({ text, className }: { text: string; className?: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <h1 className={cn("hero-title", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="hero-title-word-wrap">
          <span className="hero-title-word">{w}</span>
        </span>
      ))}
    </h1>
  );
}

function ScrollIndicator() {
  return (
    <div className="hero-scroll" aria-hidden="true">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40 animate-bounce"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

function PaginationDots({
  count,
  active,
  onClick,
}: {
  count: number;
  active: number;
  onClick: (i: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="hero-dots" role="tablist" aria-label="Hero slides">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Slide ${i + 1}`}
          className={cn("hero-dot", i === active && "hero-dot-active")}
          onClick={() => onClick(i)}
        />
      ))}
    </div>
  );
}

function HeroArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="hero-nav-arrow hero-nav-prev"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={onNext}
        aria-label="Next slide"
        className="hero-nav-arrow hero-nav-next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </>
  );
}

export default function AnimeHero({
  anime,
  items,
  activeIndex = 0,
  onDotClick,
}: AnimeHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const [imgSrc, setImgSrc] = useState(heroBg(anime));
  const reduced = prefersReducedMotion();
  const coarse = isCoarsePointer();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goNext = useCallback(() => {
    if (items && items.length > 1 && onDotClick) {
      const next = (activeIndex + 1) % items.length;
      onDotClick(next);
    }
  }, [items, activeIndex, onDotClick]);

  const goPrev = useCallback(() => {
    if (items && items.length > 1 && onDotClick) {
      const prev = (activeIndex - 1 + items.length) % items.length;
      onDotClick(prev);
    }
  }, [items, activeIndex, onDotClick]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  useEffect(() => {
    setImgSrc(heroBg(anime));
  }, [anime]);

  useEffect(() => {
    if (reduced) {
      gsap.set(
        [bgRef.current, posterRef.current, titleRef.current, metaRef.current, descRef.current, ctaRef.current, chipsRef.current],
        { clearProps: "all", opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0 0 0 0)" }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
        0
      );

      tl.fromTo(
        posterRef.current,
        { x: -80, opacity: 0, rotate: -3 },
        { x: 0, opacity: 1, rotate: 0, duration: 0.9, ease: "spring(1, 80, 12)" },
        0.2
      );

      const titleWords = titleRef.current?.querySelectorAll(".hero-title-word") || [];
      tl.fromTo(
        titleWords,
        { y: "110%" },
        { y: "0%", duration: 0.7, stagger: 0.06, ease: "power3.out" },
        0.45
      );
      tl.fromTo(
        titleRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power3.inOut" },
        0.45
      );

      const metaItems = metaRef.current?.querySelectorAll(".hero-meta-item") || [];
      tl.fromTo(
        metaItems,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        0.9
      );

      tl.fromTo(
        descRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        1.05
      );

      const ctaBtns = ctaRef.current?.querySelectorAll(".hero-cta-btn") || [];
      tl.fromTo(
        ctaBtns,
        { y: 24, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.12,
          ease: "back.out(1.6)",
        },
        1.2
      );

      const chips = chipsRef.current?.querySelectorAll(".hero-chip") || [];
      tl.fromTo(
        chips,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" },
        1.35
      );
    }, rootRef);

    return () => ctx.revert();
  }, [anime, reduced]);

  const dotCount = items?.length ?? 1;
  const display = anime;

  return (
    <section
      ref={rootRef}
      className="hero-root"
      aria-label={`Hero: ${display.title}`}
      onTouchStart={coarse ? handleTouchStart : undefined}
      onTouchEnd={coarse ? handleTouchEnd : undefined}
    >
      {/* Background */}
      <div ref={bgRef} className="hero-bg" aria-hidden="true">
        <img
          src={imgSrc}
          alt=""
          className="hero-bg-img"
          onError={() => setImgSrc("/placeholder.svg")}
        />
        <div className="hero-bg-gradient" />
        <div className="hero-bg-vignette" />
        <div className="hero-bg-grain" />
      </div>

      {/* Ambient orbs */}
      <GlowOrb size={380} color="violet" drift="a" className="hero-orb hero-orb-violet" />
      <GlowOrb size={280} color="cyan" drift="b" className="hero-orb hero-orb-cyan" />
      <GlowOrb size={200} color="pink" drift="a" className="hero-orb hero-orb-pink" />

      {/* Nav arrows */}
      {dotCount > 1 && <HeroArrows onPrev={goPrev} onNext={goNext} />}

      {/* Pagination dots */}
      <PaginationDots
        count={dotCount}
        active={activeIndex}
        onClick={onDotClick || (() => {})}
      />

      {/* Content */}
      <div className="hero-content">
        {/* Poster */}
        <div ref={posterRef} className="hero-poster-wrap">
          <div className="hero-poster">
            <img
              src={display.cover || "/placeholder.svg"}
              alt={display.title}
              className="hero-poster-img"
              onError={() => setImgSrc("/placeholder.svg")}
            />
          </div>
        </div>

        {/* Info */}
        <div className="hero-info">
          <div className="hero-title-clip" ref={titleRef}>
            <TitleWords
              text={display.title}
              className="font-display font-bold text-balance leading-[1.05] tracking-tight text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-text-default"
            />
          </div>

          <div ref={metaRef} className="hero-meta">
            {display.score != null && (
              <span className="hero-meta-item hero-score">
                <StarIcon size={18} />
                <span className="hero-score-value">
                  {scoreLabel(display.score, display.scoreSource)}
                </span>
              </span>
            )}
            {display.year && (
              <span className="hero-meta-item hero-badge">{display.year}</span>
            )}
            {display.episodes && (
              <span className="hero-meta-item hero-episodes">{display.episodes} EP</span>
            )}
          </div>

          <p ref={descRef} className="hero-desc line-clamp-3 text-text-muted max-w-xl">
            {display.synopsis}
          </p>

          <div ref={ctaRef} className="hero-ctas">
            <Magnetic strength={0.35} className="hero-cta-magnetic">
              <Link
                href={display.trailerYoutubeId ? `/watch/${display.id}` : display.siteUrl}
                className="hero-cta-btn hero-cta-primary"
              >
                <PlayIcon size={18} />
                <span>Watch Now</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2} className="hero-cta-magnetic">
              <button type="button" className="hero-cta-btn hero-cta-ghost" aria-label={`Add ${display.title} to list`}>
                <span>Add to List</span>
              </button>
            </Magnetic>
          </div>

          {display.genres.length > 0 && (
            <div ref={chipsRef} className="hero-chips">
              {display.genres.map((genre) => (
                <span key={genre} className="hero-chip">{genre}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
