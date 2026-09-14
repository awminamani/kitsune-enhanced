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

  const quickGenres = useMemo(() => genres.slice(0, 10), [genres]);

  return (
    <>
      <Aurora />
      <Grain opacity={0.03} />

      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <MobileNav />

      <main className="pt-14 md:pt-16">
        {/* Hero */}
        {heroAnime && (
          <AnimeHero
            anime={heroAnime}
            items={heroItems.length > 1 ? heroItems : undefined}
            activeIndex={heroIndex}
            onDotClick={setHeroIndex}
          />
        )}

        {/* Trending rail */}
        {trending.length > 0 && (
          <div className="relative z-10 -mt-8">
            <AnimeRail
              items={trending}
              title="Trending Now"
              onCardClick={handleCardClick}
            />
          </div>
        )}

        {/* Infinite explore grid */}
        <section className="px-4 sm:px-6 lg:px-8 pt-12">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mb-4">
            Explore
          </h2>

          {/* Genre pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveGenre("")}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                !activeGenre
                  ? "bg-accent-violet text-white"
                  : "bg-bg-card border border-border text-text-muted hover:text-text hover:border-accent-violet/40"
              }`}
            >
              All
            </button>
            {quickGenres.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g === activeGenre ? "" : g)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  activeGenre === g
                    ? "bg-accent-violet text-white"
                    : "bg-bg-card border border-border text-text-muted hover:text-text hover:border-accent-violet/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            {SORTS.map((s) => (
              <button
                key={s.v}
                onClick={() => setActiveSort(s.v)}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors ${
                  activeSort === s.v
                    ? "bg-accent-violet text-white"
                    : "bg-bg-card border border-border text-text-muted hover:text-text hover:border-accent-violet/40"
                }`}
              >
                {s.l}
              </button>
            ))}
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
