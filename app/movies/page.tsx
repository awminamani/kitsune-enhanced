// app/movies/page.tsx
import { getTopMovies } from "@/lib/anime-vault";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MovieCard from "@/components/MovieCard";

export const revalidate = 86400;

export default async function MoviesPage() {
  const movies = await getTopMovies(24).catch(() => []);

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
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Top Movies
        </h1>

        {movies.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p>No movies found — try again later.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
