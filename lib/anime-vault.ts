// lib/anime-vault.ts
// Re-export data layer from the existing lib modules.
export {
  getTrending,
  getTopMovies,
  browseAnime,
  searchAnime,
  getGenreCollection,
  getSpotlight,
} from "./anilist";
export type { BrowseOpts, SearchOpts } from "./anilist";
export { getTopMal } from "./jikan";
