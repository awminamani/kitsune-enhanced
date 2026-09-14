'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { Search, Star, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';

export interface AnimeResult {
  id: number;
  title: string;
  coverImage: string;
  score: number | null;
  year: number | null;
}

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (anime: AnimeResult) => void;
}

// Mock search — replace with real API call
const mockSearch = async (query: string): Promise<AnimeResult[]> => {
  await new Promise((r) => setTimeout(r, 400));
  if (!query.trim()) return [];
  return [
    { id: 1, title: `${query} — Saga`, coverImage: '/placeholder.png', score: 8.7, year: 2023 },
    { id: 2, title: `${query} Chronicles`, coverImage: '/placeholder.png', score: 8.2, year: 2022 },
    { id: 3, title: `${query} Zero`, coverImage: '/placeholder.png', score: 7.9, year: 2024 },
  ];
};

export default function SearchCommand({ open, onOpenChange, onSelect }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Debounced search
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await mockSearch(query);
      setResults(data);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, open]);

  const handleSelect = useCallback(
    (anime: AnimeResult) => {
      onSelect(anime);
      onOpenChange(false);
      setQuery('');
    },
    [onSelect, onOpenChange]
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search anime"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      shouldFilter={false}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-bg-soft/95 shadow-2xl shadow-black/40 backdrop-blur-xl animate-fade-in overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="shrink-0 text-fg-muted" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search anime..."
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-muted focus:outline-none"
            autoFocus
          />
          <kbd className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] font-mono text-fg-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-8 text-fg-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-sm text-fg-muted">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && results.map((anime) => (
            <Command.Item
              key={anime.id}
              value={anime.title}
              onSelect={() => handleSelect(anime)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors aria-selected:bg-violet-500/10 aria-selected:text-fg text-fg-muted"
            >
              {/* Cover thumbnail */}
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-bg">
                <Image
                  src={anime.coverImage}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-fg">{anime.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {anime.score != null && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-400">
                      <Star size={11} fill="currentColor" />
                      {anime.score.toFixed(1)}
                    </span>
                  )}
                  {anime.year != null && (
                    <span className="flex items-center gap-0.5 text-xs text-fg-muted">
                      <Calendar size={11} />
                      {anime.year}
                    </span>
                  )}
                </div>
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
