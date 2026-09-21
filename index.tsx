import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Info, Play, Search, SlidersHorizontal, X } from "lucide-react";
import { listCatalog, type CatalogItem } from "@/lib/catalog";
import { CatalogFilterChips } from "@/components/CatalogFilter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CatalogRow, PosterCard } from "@/components/CatalogRow";

export type CatalogSearch = {
  q?: string;
  star?: string;
  genre?: string;
  type?: "movie" | "series" | "anime";
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    star: typeof search.star === "string" ? search.star : undefined,
    genre: typeof search.genre === "string" ? search.genre : undefined,
    type: search.type === "movie" || search.type === "series" || search.type === "anime" ? search.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: "TryBox — Stream Movies, Series & Anime" },
      { name: "description", content: "Browse the TryBox catalog of movies, series and anime with live type and genre filtering." },
      { property: "og:title", content: "TryBox — Stream Movies, Series & Anime" },
      { property: "og:description", content: "Browse movies, series and anime with instant catalog filtering." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

function Hero({ item }: { item: CatalogItem }) {
  const img = item.backdrop || item.poster;
  return (
    <section className="relative mx-auto mt-4 max-w-[1400px] px-5">
      <div className="relative aspect-16/9 overflow-hidden rounded-3xl bg-card sm:aspect-2/1 lg:aspect-[2.6/1]">
        {img && <img src={img} alt={item.title} className="size-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center gap-3 p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <span className="capitalize">{item.genres[0] ?? item.type}</span>
            {item.year && <span>· {item.year}</span>}
            {item.rating && <span>· IMDb {item.rating}</span>}
          </div>
          {item.synopsis && <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-muted-foreground">{item.synopsis}</p>}
          <div className="mt-2 flex items-center gap-3">
            <Link to="/title/$id" params={{ id: item.id }} className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">
              <Play className="size-4 fill-current" /> Play
            </Link>
            <Link to="/title/$id" params={{ id: item.id }} className="inline-flex items-center gap-2 rounded-full bg-card/80 px-6 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card">
              <Info className="size-4" /> More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { data, isLoading, error } = useQuery({ queryKey: ["catalog"], queryFn: listCatalog, staleTime: 15_000 });

  const all = data ?? [];
  const genres = Array.from(new Set(
    all
      .filter((item) => !search.type || item.type === search.type)
      .flatMap((item) => item.genres),
  )).sort((a, b) => a.localeCompare(b));

  const items = all.filter((item) => {
    if (search.q) {
      const q = search.q.toLowerCase().trim();
      const haystack = [item.title, item.synopsis ?? "", item.imdb_id ?? "", ...item.genres, ...item.stars]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (search.star && !item.stars.some((s) => s.toLowerCase() === search.star!.toLowerCase())) return false;
    if (search.genre && !item.genres.some((g) => g.toLowerCase() === search.genre!.toLowerCase())) return false;
    if (search.type && item.type !== search.type) return false;
    return true;
  });

  const typeTitle = search.type === "movie" ? "Movies" : search.type === "series" ? "TV Series" : search.type === "anime" ? "Anime" : "Everything";
  const isFilteredView = Boolean(search.type || search.genre || search.q || search.star);
  const hero = items[0];

  const setSearch = (next: Partial<CatalogSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...next }) });

  const clearAll = () => void navigate({ search: {} });

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader />

      {isLoading && <p className="py-24 text-center text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="py-24 text-center text-sm text-destructive">Could not load the catalog.</p>}

      {!isLoading && !error && hero && !isFilteredView && <Hero item={hero} />}

      <main className="mx-auto max-w-[1400px] px-5 pb-10">
        <div className="mt-7 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">TryBox catalog</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{typeTitle}</h1>
          </div>
          {isFilteredView && (
            <button onClick={clearAll} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
              <X className="size-3.5" /> Clear filters
            </button>
          )}
        </div>

        <CatalogFilterChips
          selectedStar={search.star}
          selectedGenre={search.genre}
          onClearStar={() => setSearch({ star: undefined })}
          onClearGenre={() => setSearch({ genre: undefined })}
        />

        {search.type && (
          <section className="mt-5 rounded-2xl border border-border bg-card/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="size-4 text-primary" />
              All categories / genres
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSearch({ genre: undefined })}
                className={!search.genre ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground" : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"}
              >
                All {typeTitle}
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSearch({ genre })}
                  className={search.genre?.toLowerCase() === genre.toLowerCase() ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground" : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"}
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>
        )}

        {search.q && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Search results for <strong>“{search.q}”</strong></span>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">Nothing matches this filter yet.</p>}

        {isFilteredView ? (
          <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item) => <PosterCard key={item.id} item={item} />)}
          </div>
        ) : (
          <>
            <CatalogRow title="Top 10 Today" items={items.slice(0, 10)} variant="ranked" />
            <CatalogRow title="We think you'll love this!" items={items.slice(0, 8)} variant="backdrop" />
            <CatalogRow title="Popular Movies" items={items.filter((i) => i.type === "movie")} />
            <CatalogRow title="Trending TV" items={items.filter((i) => i.type === "series")} />
            <CatalogRow title="Anime Picks" items={items.filter((i) => i.type === "anime")} />
            {genres.slice(0, 10).map((genre) => (
              <CatalogRow key={genre} title={genre} items={items.filter((i) => i.genres.some((g) => g.toLowerCase() === genre.toLowerCase()))} />
            ))}
            <CatalogRow title="Recently Added" items={items} />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
