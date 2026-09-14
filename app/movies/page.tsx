// app/movies/page.tsx
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getTopMovies } from "@/lib/anime-vault";
import MovieGrid from "@/components/MovieGrid";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search logic here
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header with back button and search */}
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full rounded-full bg-bg-card border border-border pl-9 pr-4 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent-violet/40"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Top Movies
        </h1>
        <MovieGrid movies={movies} />
      </div>
    </div>
  );
}
