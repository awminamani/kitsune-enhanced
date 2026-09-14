'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Anime } from '@/lib/types';

interface AnimeRailProps {
  items: Anime[];
  title: string;
  showRank?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function AnimeRail({
  items,
  title,
  showRank = false,
  viewAllHref,
  className,
}: AnimeRailProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
    align: 'start',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('resize', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <section className={cn('relative', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-white/50 hover:text-violet-400 transition-colors duration-200"
            >
              View all
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Scroll left"
              className={cn(
                'hidden sm:flex size-8 items-center justify-center rounded-full',
                'bg-bg-secondary text-white/70 transition-all duration-200',
                'hover:bg-violet-600/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Scroll right"
              className={cn(
                'hidden sm:flex size-8 items-center justify-center rounded-full',
                'bg-bg-secondary text-white/70 transition-all duration-200',
                'hover:bg-violet-600/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
            {items.map((anime, i) => (
              <div key={anime.id} className="shrink-0 w-40 sm:w-44">
                <Link
                  href={anime.siteUrl}
                  className="group relative block outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  <div className="relative rounded-lg overflow-hidden bg-bg-card border border-border cursor-pointer will-change-transform transition-transform duration-300 hover:scale-[1.03] hover:border-accent-violet/40">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={anime.cover}
                        alt={anime.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      {anime.score != null && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-1 text-xs font-semibold text-amber-400">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>
                          <span>{anime.scoreSource === 'mal' ? anime.score.toFixed(2) : `${anime.score}%`}</span>
                        </div>
                      )}
                      {showRank && i < 9 && (
                        <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 rounded-md bg-violet-600/80 backdrop-blur-sm text-xs font-bold text-white">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-text line-clamp-1">{anime.title}</p>
                      <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                        {[anime.year, anime.episodes ? `${anime.episodes} EP` : null].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint indicator at right edge */}
        {canScrollNext && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 sm:w-24 flex items-center justify-end bg-gradient-to-l from-bg via-bg/80 to-transparent z-10"
          >
            <div className="mr-2 sm:mr-4 animate-pulse">
              <div className="flex items-center gap-0.5 text-violet-400">
                <ChevronRight className="size-5" />
                <ChevronRight className="size-5 -ml-2" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
