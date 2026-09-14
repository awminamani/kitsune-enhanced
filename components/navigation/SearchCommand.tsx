'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { Search, Star, Calendar, Loader2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface AnimeResult {
  id: string;
  title: string;
  cover: string;
  score: number | null;
  scoreSource?: 'anilist' | 'mal';
  year: number | null;
  genres: string[];
  episodes?: number;
}

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (anime: AnimeResult) => void;
}

const TRENDING_SUGGESTIONS = [
  { id: '1', title: 'Frieren: Beyond Journey\'s End', cover: '', score: 9.3, year: 2023, genres: ['Adventure', 'Fantasy'] },
  { id: '2', title: 'Solo Leveling', cover: '', score: 8.8, year: 2024, genres: ['Action', 'Fantasy'] },
  { id: '3', title: 'Oshi no Ko', cover: '', score: 8.9, year: 2023, genres: ['Drama', 'Supernatural'] },
  { id: '4', title: 'Jujutsu Kaisen', cover: '', score: 8.7, year: 2020, genres: ['Action', 'Supernatural'] },
  { id: '5', title: 'Attack on Titan', cover: '', score: 9.1, year: 2013, genres: ['Action', 'Drama'] },
];

const RECENT_SEARCHES_KEY = 'animevault-recent-searches';
const MAX_RECENT = 5;

export default function SearchCommand({ open, onOpenChange, onSelect }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  // Real search via API
  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, open]);

  const saveRecent = useCallback((q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
  }, [recentSearches]);

  const handleSelect = useCallback(
    (anime: AnimeResult) => {
      onSelect(anime);
      onOpenChange(false);
      setQuery('');
    },
    [onSelect, onOpenChange]
  );

  const handleSuggestionClick = useCallback((title: string) => {
    setQuery(title);
    saveRecent(title);
  }, [saveRecent]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search anime"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh]"
      shouldFilter={false}
    >
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl mx-4 rounded-2xl border border-white/10 bg-[#0a0a14]/98 shadow-2xl shadow-black/50 overflow-hidden animate-scale-in">
        {/* Input */}
        <div className="relative border-b border-white/5">
          <div className="flex items-center gap-3 px-5 py-4">
            <Search size={20} className="shrink-0 text-accent-violet" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search anime by title..."
              className="flex-1 bg-transparent text-base text-text placeholder:text-text-muted/60 focus:outline-none"
              autoFocus
            />
            {!query && (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-text-muted">
                ESC
              </kbd>
            )}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-text-muted hover:text-text transition-colors"
              >
                <span className="sr-only">Clear</span>
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2 size={24} className="animate-spin text-accent-violet" />
              <span className="text-sm text-text-muted">Searching the vault...</span>
            </div>
          )}

          {/* Empty state with trending + recent */}
          {!loading && !query.trim() && (
            <div className="p-4 space-y-5">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                    <Clock size={12} />
                    Recent searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-text-muted hover:text-text hover:bg-white/10 transition-colors"
                      >
                        <Clock size={11} className="opacity-50" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending suggestions */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  <TrendingUp size={12} />
                  Trending now
                </h3>
                <div className="space-y-1">
                  {TRENDING_SUGGESTIONS.map((anime) => (
                    <button
                      key={anime.id}
                      onClick={() => handleSuggestionClick(anime.title)}
                      className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 border border-accent-violet/20">
                        <Sparkles size={14} className="text-accent-violet" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{anime.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                          {anime.score && <span className="text-amber-400">{anime.score}</span>}
                          {anime.year && <span>{anime.year}</span>}
                          {anime.genres.slice(0, 2).map(g => (
                            <span key={g} className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px]">{g}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-text-muted">
              <Search size={32} className="opacity-30" />
              <span className="text-sm">No anime found for &ldquo;{query}&rdquo;</span>
              <span className="text-xs opacity-60">Try a different title</span>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <Command.List className="p-2">
              <div className="px-3 py-1.5 text-xs font-medium text-text-muted">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((anime) => (
                <Command.Item
                  key={anime.id}
                  value={anime.title}
                  onSelect={() => handleSelect(anime)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors data-[selected=true]:bg-accent-violet/10 data-[selected=true]:text-text text-text-muted"
                >
                  {/* Cover thumbnail */}
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-elevated border border-white/5">
                    {anime.cover ? (
                      <img
                        src={anime.cover}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-accent-violet/40 text-lg font-bold">
                        {anime.title[0]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-text">{anime.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {anime.score != null && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-400">
                          <Star size={10} fill="currentColor" />
                          {anime.scoreSource === 'mal' ? anime.score.toFixed(2) : `${anime.score}%`}
                        </span>
                      )}
                      {anime.year && (
                        <span className="flex items-center gap-0.5 text-xs text-text-muted">
                          <Calendar size={10} />
                          {anime.year}
                        </span>
                      )}
                      {anime.episodes && (
                        <span className="text-xs text-text-muted">{anime.episodes} EP</span>
                      )}
                    </div>
                    {anime.genres.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {anime.genres.slice(0, 3).map(g => (
                          <span key={g} className="rounded-full bg-white/5 border border-white/5 px-1.5 py-0.5 text-[9px] text-text-muted">{g}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Command.Item>
              ))}
            </Command.List>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-white/5 px-5 py-3 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">↑</kbd>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}
