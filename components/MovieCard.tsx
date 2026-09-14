'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  cover: string;
  score?: number;
  scoreSource?: string;
  year?: number;
  episodes?: number;
}

export default function MovieCard({ id, title, cover, score, scoreSource, year }: MovieCardProps) {
  const [src, setSrc] = useState(cover);

  return (
    <div className="group relative rounded-lg overflow-hidden bg-bg-card border border-border cursor-pointer transition-transform hover:scale-[1.03] hover:border-accent-violet/40">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={src || "/placeholder.svg"}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          onError={() => setSrc("/placeholder.svg")}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        {score != null && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-1 text-xs font-semibold text-amber-400">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>{scoreSource === 'mal' ? score.toFixed(2) : `${score}%`}</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-violet-600/90 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-text line-clamp-1">{title}</p>
        <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
          {[year, 'Movie'].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}
