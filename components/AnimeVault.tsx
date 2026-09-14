// components/AnimeVault.tsx
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Anime } from "@/lib/types";
import { Aurora, Grain } from "@/components/effects";
import { Navbar, MobileNav, SearchCommand } from "@/components/navigation";
import AnimeHero from "@/components/anime/AnimeHero";
import { AnimeRail } from "@/components/anime/AnimeRail";
import AnimeModal from "@/components/anime/AnimeModal";
import InfiniteGrid from "@/components/InfiniteGrid";

const SORTS = [
  { v: "POPULARITY_DESC", l: "Popular" },
  { v: "SCORE_DESC", l: "Top rated" },
  { v: "TRENDING_DESC", l: "Trending" },
  { v: "FAVOURITES_DESC", l: "Most loved" },
];

interface AnimeVaultProps {
  trending: Anime[];
  movies: Anime[];
  topMal: Anime[];
  genres: string[];
}

export default function AnimeVault({
  trending,
  movies,
  topMal,
  genres,
}: AnimeVaultProps) {
  const [openAnime, setOpenAnime] = useState<Anime | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeGenre, setActiveGenre] = useState<string>("");
  const [activeSort, setActiveSort] = useState("POPULARITY_DESC");

  const heroItems = trending.slice(0, Math.min(6, trending.length));
  const heroAnime = heroItems[heroIndex] ?? trending[0];

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroItems.length),
      8000
    );
    return () => clearInterval(t);
  }, [heroItems.length]);

  const handleCardClick = useCallback((anime: Anime) => {
    setOpenAnime(anime);
  }, []);

  const handleSearchSelect = useCallback((result: any) => {
    setSearchOpen(false);
  }, []);

  const quickGenres = useMemo(() => genres.slice(0, 8), [genres]);

  return (
    <>
      <Aurora />
      <Grain opacity={0.03} />

      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <MobileNav />

      <main className="pt-14 md:pt-16">
        {heroAnime && (
          <AnimeHero
            anime={heroAnime}
            items={heroItems.length > 1 ? heroItems : undefined}
            activeIndex={heroIndex}
            onDotClick={setHeroIndex}
          />
        )}

        {trending.length > 0 && (
          <div className="relative z-10 -mt-8">
            <AnimeRail
              items={trending}
              title="Trending Now"
              onCardClick={handleCardClick}
            />
          </div>
        )}

        <section className="px-4 sm:px-6 lg:px-8 pt-12">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mb-4">
            Explore
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveGenre("")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  !activeGenre
                    ? "bg-accent-violet text-white shadow-glow-violet"
                    : "bg-white/5 border border-white/10 text-text-muted hover:text-text hover:border-accent-violet/30"
                }`}
              >
                All
              </button>
              {quickGenres.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g === activeGenre ? "" : g)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeGenre === g
                      ? "bg-accent-violet text-white shadow-glow-violet"
                      : "bg-white/5 border border-white/10 text-text-muted hover:text-text hover:border-accent-violet/30"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {SORTS.map((s) => (
                <button
                  key={s.v}
                  onClick={() => setActiveSort(s.v)}
                  className={`flex-shrink-0 px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeSort === s.v
                      ? "bg-accent-violet text-white shadow-glow-violet"
                      : "bg-white/5 border border-white/10 text-text-muted hover:text-text hover:border-accent-violet/30"
                  }`}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <InfiniteGrid
            genre={activeGenre || undefined}
            sort={activeSort}
            onCardClick={handleCardClick}
          />
        </section>
      </main>

      <AnimeModal anime={openAnime} onClose={() => setOpenAnime(null)} />

      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSearchSelect}
      />
    </>
  );
}
