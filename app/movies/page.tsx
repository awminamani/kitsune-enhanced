// app/movies/page.tsx
import { getTopMovies } from "@/lib/anime-vault";
import MovieGrid from "@/components/MovieGrid";

export const revalidate = 86400;

export default async function MoviesPage() {
  const movies = await getTopMovies(24).catch(() => []);

  return (
    <div className="min-h-screen bg-bg pt-20">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          Top Movies
        </h1>
        <p className="text-text-muted mb-8">
          The highest-rated anime movies of all time.
        </p>
        <MovieGrid movies={movies} />
      </div>
    </div>
  );
}
