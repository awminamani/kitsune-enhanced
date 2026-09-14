'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { Anime } from '@/lib/types';
import MovieCard from './MovieCard';
import SearchCommand from '@/components/navigation/SearchCommand';

export default function MoviesClient({ initialMovies }: { initialMovies: Anime[] }) {
  const [movies, setMovies] = useState<Anime[]>(initialMovies);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const handleSearchSelect = useCallback((result: any) => {
    setSearchOpen(false);
    handleSearch(result.title);
  }, [handleSearch]);

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
      {/* Search area */}
      <div className="h-12 mb-4 relative">
        {/* Full bar at top */}
        <div
          className={`absolute inset-0 flex items-center transition-all duration-300 ${
            scrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 w-full max-w-sm rounded-full bg-bg-card border border-border px-4 py-2.5 text-left text-text-muted hover:border-accent-violet/40 transition-colors"
          >
            <Search size={16} />
            <span className="text-sm">Search movies...</span>
          </button>
        </div>

        {/* Floating icon when scrolled */}
        <div
          className={`fixed top-3 right-4 z-40 transition-all duration-300 ${
            scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full bg-bg-soft/90 border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-accent-violet/40 transition-colors backdrop-blur-sm shadow-lg"
          >
            <Search size={18} />
          </button>
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

      {/* Shared SearchCommand dialog */}
      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSearchSelect}
      />
    </div>
  );
}
