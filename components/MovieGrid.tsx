'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  cover: string;
  score?: number;
  scoreSource?: 'anilist' | 'mal';
  year?: number;
  episodes?: number;
  genres: string[];
}

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted">
        <p>No movies found — try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="group relative rounded-lg overflow-hidden bg-bg-card border border-border cursor-pointer transition-transform hover:scale-[1.03] hover:border-accent-violet/40"
        >
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={errorIds.has(movie.id) ? '/placeholder.svg' : movie.cover}
              alt={movie.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              onError={() => setErrorIds(prev => new Set(prev).add(movie.id))}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            {movie.score != null && (
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-1 text-xs font-semibold text-amber-400">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{movie.scoreSource === 'mal' ? movie.score.toFixed(2) : `${movie.score}%`}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-violet-600/90 flex items-center justify-center shadow-lg shadow-violet-600/30">
                <Play className="size-5 fill-white text-white translate-x-0.5" />
              </div>
            </div>
          </div>
          <div className="p-2.5">
            <p className="text-xs font-medium text-text line-clamp-1">{movie.title}</p>
            <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
              {[movie.year, 'Movie'].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
