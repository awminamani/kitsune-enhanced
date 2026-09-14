// app/movies/page.tsx
import { getTopMovies } from "@/lib/anime-vault";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MoviesClient from "@/components/MoviesClient";

export const revalidate = 86400;

export default async function MoviesPage() {
  const initialMovies = await getTopMovies(24).catch(() => []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky header with back button */}
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Top Movies
        </h1>
        <p className="text-text-muted mb-6">
          The highest-rated anime movies of all time.
        </p>
        <MoviesClient initialMovies={initialMovies} />
      </div>
    </div>
  );
}
