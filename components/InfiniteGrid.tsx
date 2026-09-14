// components/InfiniteGrid.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Anime } from "@/lib/types";

interface InfiniteGridProps {
  genre?: string;
  sort?: string;
  onCardClick: (anime: Anime) => void;
}

export default function InfiniteGrid({ genre, sort = "POPULARITY_DESC", onCardClick }: InfiniteGridProps) {
  const [items, setItems] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Reset when genre/sort changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setInitialized(false);
  }, [genre, sort]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), sort });
      if (genre) params.set("genre", genre);
      const res = await fetch(`/api/browse?${params}`);
      const data = await res.json();
      setItems(prev => [...prev, ...(data.results || [])]);
      setPage(p => p + 1);
      setHasMore(!!data.hasNextPage);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [page, hasMore, loading, genre, sort]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  // Initial load
  useEffect(() => {
    if (!initialized) loadMore();
  }, [initialized, loadMore]);

  if (items.length === 0 && !loading) {
    return <p className="text-text-muted text-center py-12">Nothing here yet.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((anime) => (
          <div
            key={anime.id}
            role="button"
            tabIndex={0}
            onClick={() => onCardClick(anime)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCardClick(anime); }}
            className="group relative rounded-lg overflow-hidden bg-bg-card border border-border cursor-pointer transition-transform hover:scale-[1.03] hover:border-accent-violet/40"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={anime.cover || "/placeholder.svg"}
                alt={anime.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              {anime.score != null && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-1 text-xs font-semibold text-amber-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>
                  <span>{anime.scoreSource === 'mal' ? anime.score.toFixed(2) : `${anime.score}%`}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-violet-600/90 flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium text-text line-clamp-1">{anime.title}</p>
              <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                {[anime.year, anime.episodes ? `${anime.episodes} EP` : null].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden bg-bg-card border border-border">
              <div className="aspect-[2/3] bg-gradient-to-r from-bg-elevated to-bg-card" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-bg-elevated rounded animate-pulse" />
                <div className="h-2 bg-bg-elevated rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={sentinel} className="h-1" aria-hidden="true" />
    </div>
  );
}
