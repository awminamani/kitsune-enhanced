'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { browseAnime } from '@/lib/anime-vault';
import type { Anime } from '@/lib/types';
import MovieCard from './MovieCard';

export default function MoviesClient({ initialMovies }: { initialMovies: Anime[] }) {
  const [movies, setMovies] = useState<Anime[]>(initialMovies);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/browse?page=${page}&sort=SCORE_DESC&format=MOVIE`);
      const data = await res.json();
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(p => p + 1);
      setHasMore(!!data.hasNextPage);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, searchQuery]);

  // Search
  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setMovies(initialMovies);
      setPage(2);
      setHasMore(true);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&format=MOVIE`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch {
      setMovies([]);
    } finally {
      setSearching(false);
    }
  }, [initialMovies]);

  // IntersectionObserver
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-full bg-bg-card border border-border pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-violet/40"
          />
        </div>
      </div>

      {/* Results */}
      {searching && (
        <div className="text-center py-8 text-text-muted text-sm">Searching...</div>
      )}

      {!searching && movies.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          {searchQuery ? `No movies found for "${searchQuery}"` : 'No movies found.'}
        </div>
      )}

      {!searching && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                cover={movie.cover}
                score={movie.score}
                scoreSource={movie.scoreSource}
                year={movie.year}
                episodes={movie.episodes}
              />
            ))}
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-bg-card border border-border">
                  <div className="aspect-[2/3] bg-bg-elevated" />
                  <div className="p-2.5 space-y-2">
                    <div className="h-3 bg-bg-elevated rounded" />
                    <div className="h-2 bg-bg-elevated rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={sentinel} className="h-1" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
