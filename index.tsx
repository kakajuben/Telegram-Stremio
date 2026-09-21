import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import {
  Info,
  Play,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Check,
  Pencil,
  ShieldAlert,
  Star,
  Sparkles,
} from "lucide-react";

import {
  listCatalog,
  type CatalogItem,
} from "@/lib/catalog";

import { CatalogFilterChips } from "@/components/CatalogFilter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CatalogRow } from "@/components/CatalogRow";

import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";


/* =========================================================
   SEARCH PARAMS
   ========================================================= */

export type CatalogSearch = {
  q?: string;
  star?: string;
  genre?: string;
  type?: "movie" | "series" | "anime";
};


/* =========================================================
   ROUTE
   ========================================================= */

export const Route = createFileRoute("/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): CatalogSearch => ({
    q:
      typeof search.q === "string"
        ? search.q
        : undefined,

    star:
      typeof search.star === "string"
        ? search.star
        : undefined,

    genre:
      typeof search.genre === "string"
        ? search.genre
        : undefined,

    type:
      search.type === "movie" ||
      search.type === "series" ||
      search.type === "anime"
        ? search.type
        : undefined,
  }),

  head: () => ({
    meta: [
      {
        title:
          "TryBox — Stream Movies, Series & Anime",
      },
      {
        name: "description",
        content:
          "Browse and stream movies, series and anime on TryBox.",
      },
      {
        property: "og:title",
        content:
          "TryBox — Stream Movies, Series & Anime",
      },
      {
        property: "og:description",
        content:
          "Browse movies, series and anime with instant catalog filtering.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: CatalogPage,
});


/* =========================================================
   HERO
   ========================================================= */

function Hero({
  item,
  isSaved,
  isAdmin,
  onToggleWatchlist,
  onPlay,
}: {
  item: CatalogItem;
  isSaved: boolean;
  isAdmin: boolean;
  onToggleWatchlist: () => void;
  onPlay: () => void;
}) {
  const img =
    item.backdrop ||
    item.poster ||
    undefined;

  return (
    <section className="relative h-[65vh] min-h-[460px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black">

        {img && (
          <img
            src={img}
            alt={item.title}
            className="
              h-full
              w-full
              object-cover
              object-top
              opacity-50
              brightness-90
            "
          />
        )}

        {/* Bottom gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-background
            via-background/60
            to-transparent
          "
        />

        {/* Left gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-background
            via-transparent
            to-transparent
          "
        />
      </div>


      {/* Hero content */}
      <div
        className="
          relative
          mx-auto
          flex
          h-full
          max-w-7xl
          flex-col
          justify-end
          px-4
          pb-12
          sm:px-6
        "
      >
        <div className="max-w-2xl space-y-3">

          {/* Type + rating */}
          <div className="flex flex-wrap items-center gap-2">

            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-md
                border
                border-primary/30
                bg-primary/20
                px-2
                py-0.5
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-primary
              "
            >
              <Sparkles className="size-3" />

              Featured {item.type}
            </span>


            {item.rating && (
              <span
                className="
                  flex
                  items-center
                  gap-1
                  rounded-md
                  bg-black/60
                  px-2
                  py-0.5
                  text-xs
                  font-medium
                  text-amber-400
                  backdrop-blur
                "
              >
                <Star className="size-3 fill-current" />

                {item.rating}
              </span>
            )}
          </div>


          {/* Title */}
          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-foreground
              drop-shadow-md
              sm:text-5xl
              lg:text-6xl
            "
          >
            {item.title}
          </h1>


          {/* Metadata */}
          <p
            className="
              text-xs
              font-medium
              text-muted-foreground
              sm:text-sm
            "
          >
            {item.year ?? "—"}

            {" • "}

            {item.genres?.join(", ") ||
              item.type}
          </p>


          {/* Synopsis */}
          {item.synopsis && (
            <p
              className="
                line-clamp-3
                max-w-xl
                text-xs
                leading-relaxed
                text-foreground/80
                sm:text-sm
              "
            >
              {item.synopsis}
            </p>
          )}


          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">

            {/* Play */}
            <button
              type="button"
              onClick={onPlay}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-2.5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-lg
                transition-all
                hover:opacity-90
              "
            >
              <Play
                className="size-4 fill-current"
              />

              <span>Play</span>
            </button>


            {/* Watchlist */}
            <button
              type="button"
              onClick={onToggleWatchlist}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                bg-card/80
                px-4
                py-2.5
                text-sm
                font-medium
                text-foreground
                backdrop-blur
                transition-all
                hover:bg-card
              "
            >
              {isSaved ? (
                <>
                  <Check className="size-4 text-green-400" />
                  <span>Saved to My Box</span>
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  <span>Add to My Box</span>
                </>
              )}
            </button>


            {/* More information */}
            <Link
              to="/title/$id"
              params={{
                id: item.id,
              }}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                bg-card/70
                px-4
                py-2.5
                text-sm
                font-medium
                text-foreground
                backdrop-blur
                transition
                hover:bg-card
              "
            >
              <Info className="size-4" />

              <span>More Info</span>
            </Link>


            {/* Admin edit */}
            {isAdmin && (
              <Link
                to="/admin"
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-amber-500/40
                  bg-amber-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-amber-400
                  transition-all
                  hover:bg-amber-500/20
                "
              >
                <Pencil className="size-4" />

                <span>Edit This Title</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   MAIN PAGE
   ========================================================= */

function CatalogPage() {
  const search = Route.useSearch();

  const navigate = useNavigate({
    from: "/",
  });

  const {
    user,
    isAdmin,
  } = useAuth();

  const {
    isInWatchlist,
    toggleWatchlist,
  } = useWatchlist();


  /* -------------------------------------------------------
     CATALOG
     ------------------------------------------------------- */

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["catalog"],
    queryFn: listCatalog,
    staleTime: 15_000,
  });


  const all = data ?? [];


  /* -------------------------------------------------------
     GENRES
     ------------------------------------------------------- */

  const genres = Array.from(
    new Set(
      all
        .filter(
          (item) =>
            !search.type ||
            item.type === search.type,
        )
        .flatMap(
          (item) => item.genres ?? [],
        ),
    ),
  ).sort((a, b) =>
    a.localeCompare(b),
  );


  /* -------------------------------------------------------
     FILTERING
     ------------------------------------------------------- */

  const items = all.filter((item) => {

    /* Search */
    if (search.q) {
      const q =
        search.q
          .toLowerCase()
          .trim();

      const haystack = [
        item.title,
        item.synopsis ?? "",
        item.imdb_id ?? "",
        ...item.genres,
        ...item.stars,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(q)) {
        return false;
      }
    }


    /* Star */
    if (
      search.star &&
      !item.stars.some(
        (star) =>
          star.toLowerCase() ===
          search.star!.toLowerCase(),
      )
    ) {
      return false;
    }


    /* Genre */
    if (
      search.genre &&
      !item.genres.some(
        (genre) =>
          genre.toLowerCase() ===
          search.genre!.toLowerCase(),
      )
    ) {
      return false;
    }


    /* Type */
    if (
      search.type &&
      item.type !== search.type
    ) {
      return false;
    }


    return true;
  });


  /* -------------------------------------------------------
     HERO
     ------------------------------------------------------- */

  const hero =
    items[0];

  const isHeroSaved =
    hero
      ? isInWatchlist(hero.id)
      : false;


  /* -------------------------------------------------------
     TITLES
     ------------------------------------------------------- */

  const typeTitle =
    search.type === "movie"
      ? "Movies"
      : search.type === "series"
        ? "TV Series"
        : search.type === "anime"
          ? "Anime"
          : "Everything";


  const isFilteredView =
    Boolean(
      search.type ||
      search.genre ||
      search.q ||
      search.star,
    );


  /* -------------------------------------------------------
     URL SEARCH UPDATE
     ------------------------------------------------------- */

  const setSearch = (
    next: Partial<CatalogSearch>,
  ) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        ...next,
      }),
    });
  };


  const clearAll = () => {
    void navigate({
      search: {},
    });
  };


  /* -------------------------------------------------------
     HERO PLAY
     ------------------------------------------------------- */

  const playHero = () => {
    if (!hero) return;

    const firstSource =
      hero.sources?.[0];

    if (firstSource?.url) {
      window.open(
        firstSource.url,
        "_blank",
        "noopener,noreferrer",
      );

      return;
    }

    void navigate({
      to: "/title/$id",
      params: {
        id: hero.id,
      },
    });
  };


  /* -------------------------------------------------------
     RENDER
     ------------------------------------------------------- */

  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
        selection:bg-primary
        selection:text-primary-foreground
      "
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <SiteHeader />


      {/* =================================================
          ADMIN BAR
          ================================================= */}

      {isAdmin && (
        <div
          className="
            border-b
            border-amber-500/20
            bg-amber-500/10
            px-4
            py-2
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-7xl
              items-center
              justify-between
              text-xs
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                font-medium
                text-amber-400
              "
            >
              <ShieldAlert className="size-4" />

              <span>
                Admin Mode Active
              </span>
            </div>

            <Link
              to="/admin"
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                bg-amber-500
                px-3
                py-1
                font-semibold
                text-black
                transition-colors
                hover:bg-amber-400
              "
            >
              <Plus className="size-3.5" />

              <span>
                Add New Title
              </span>
            </Link>
          </div>
        </div>
      )}


      {/* =================================================
          LOADING / ERROR
          ================================================= */}

      {isLoading && (
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground">
            Loading TryBox catalog…
          </p>
        </div>
      )}


      {error && (
        <div className="py-24 text-center">
          <p className="text-sm text-destructive">
            Could not load the catalog.
          </p>
        </div>
      )}


      {!isLoading &&
        !error &&
        hero &&
        !isFilteredView && (
          <Hero
            item={hero}
            isSaved={isHeroSaved}
            isAdmin={isAdmin}
            onToggleWatchlist={() =>
              void toggleWatchlist(
                hero.id,
              )
            }
            onPlay={playHero}
          />
        )}


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="pb-16">

        <div
          className="
            mx-auto
            max-w-[1400px]
            px-5
          "
        >

          {/* Heading */}
          <div
            className="
              mt-7
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>

              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                TryBox catalog
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-foreground
                  sm:text-3xl
                "
              >
                {typeTitle}
              </h1>

            </div>


            {/* Clear filters */}
            {isFilteredView && (
              <button
                type="button"
                onClick={clearAll}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-border
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-muted-foreground
                  hover:bg-accent
                  hover:text-foreground
                "
              >
                <X className="size-3.5" />

                Clear filters
              </button>
            )}
          </div>


          {/* Active filters */}
          <CatalogFilterChips
            selectedStar={search.star}
            selectedGenre={search.genre}
            onClearStar={() =>
              setSearch({
                star: undefined,
              })
            }
            onClearGenre={() =>
              setSearch({
                genre: undefined,
              })
            }
          />


          {/* =================================================
              GENRE FILTERS FOR SELECTED TYPE
              ================================================= */}

          {search.type && (
            <section
              className="
                mt-5
                rounded-2xl
                border
                border-border
                bg-card/50
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                <SlidersHorizontal
                  className="size-4 text-primary"
                />

                All categories / genres
              </div>


              <div className="mt-3 flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setSearch({
                      genre: undefined,
                    })
                  }
                  className={
                    !search.genre
                      ? `
                        rounded-full
                        bg-primary
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-primary-foreground
                      `
                      : `
                        rounded-full
                        border
                        border-border
                        px-3
                        py-1.5
                        text-xs
                        text-muted-foreground
                        hover:bg-accent
                        hover:text-foreground
                      `
                  }
                >
                  All {typeTitle}
                </button>


                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() =>
                      setSearch({
                        genre,
                      })
                    }
                    className={
                      search.genre?.toLowerCase() ===
                      genre.toLowerCase()
                        ? `
                          rounded-full
                          bg-primary
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-primary-foreground
                        `
                        : `
                          rounded-full
                          border
                          border-border
                          px-3
                          py-1.5
                          text-xs
                          text-muted-foreground
                          hover:bg-accent
                          hover:text-foreground
                        `
                    }
                  >
                    {genre}
                  </button>
                ))}

              </div>
            </section>
          )}


          {/* =================================================
              SEARCH RESULT MESSAGE
              ================================================= */}

          {search.q && (
            <div
              className="
                mt-5
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-border
                bg-card
                px-4
                py-3
              "
            >
              <Search
                className="size-4 text-muted-foreground"
              />

              <span className="text-sm text-foreground">
                Search results for{" "}
                <strong>
                  “{search.q}”
                </strong>
              </span>
            </div>
          )}


          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {!isLoading &&
            !error &&
            items.length === 0 && (
              <p
                className="
                  py-20
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                Nothing matches this filter yet.
              </p>
            )}


          {/* =================================================
              FILTERED VIEW
              ================================================= */}

          {!isLoading &&
            !error &&
            isFilteredView &&
            items.length > 0 && (

              <div
                className="
                  mt-7
                  grid
                  grid-cols-2
                  gap-5
                  sm:grid-cols-3
                  lg:grid-cols-6
                "
              >
                {items.map((item) => (
                  <Link
                    key={item.id}
                    to="/title/$id"
                    params={{
                      id: item.id,
                    }}
                    className="group"
                  >
                    <div
                      className="
                        relative
                        aspect-[2/3]
                        overflow-hidden
                        rounded-xl
                        bg-secondary
                        ring-1
                        ring-border/60
                        transition
                        duration-300
                        group-hover:scale-[1.03]
                        group-hover:ring-primary/60
                      "
                    >
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={`${item.title} poster`}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                            flex
                            size-full
                            items-center
                            justify-center
                            px-2
                            text-center
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {item.title}
                        </div>
                      )}

                      {item.rating && (
                        <span
                          className="
                            absolute
                            right-1.5
                            top-1.5
                            rounded-md
                            bg-background/80
                            px-1.5
                            py-0.5
                            text-[10px]
                            font-semibold
                            text-amber-400
                            backdrop-blur
                          "
                        >
                          ★ {item.rating}
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        mt-2
                        truncate
                        text-sm
                        font-medium
                        text-foreground
                      "
                    >
                      {item.title}
                    </p>

                    <p
                      className="
                        text-xs
                        capitalize
                        text-muted-foreground
                      "
                    >
                      {item.type}

                      {item.year
                        ? ` · ${item.year}`
                        : ""}
                    </p>
                  </Link>
                ))}
              </div>
            )}


          {/* =================================================
              NORMAL CATALOG VIEW
              ================================================= */}

          {!isLoading &&
            !error &&
            !isFilteredView &&
            items.length > 0 && (
              <div className="mt-7 space-y-10">

                {/* Top 10 */}
                <CatalogRow
                  title="Top 10 Today"
                  items={items.slice(0, 10)}
                  variant="ranked"
                />


                {/* Trending TV */}
                {items.some(
                  (item) =>
                    item.type === "series",
                ) && (
                  <CatalogRow
                    title="Trending TV Series"
                    items={items.filter(
                      (item) =>
                        item.type ===
                        "series",
                    )}
                  />
                )}


                {/* Movies */}
                {items.some(
                  (item) =>
                    item.type === "movie",
                ) && (
                  <CatalogRow
                    title="Blockbuster Movies"
                    items={items.filter(
                      (item) =>
                        item.type ===
                        "movie",
                    )}
                  />
                )}


                {/* Anime */}
                {items.some(
                  (item) =>
                    item.type === "anime",
                ) && (
                  <CatalogRow
                    title="Popular Anime"
                    items={items.filter(
                      (item) =>
                        item.type ===
                        "anime",
                    )}
                  />
                )}


                {/* Genres */}
                {genres
                  .slice(0, 10)
                  .map((genre) => {

                    const genreItems =
                      items.filter(
                        (item) =>
                          item.genres.some(
                            (itemGenre) =>
                              itemGenre.toLowerCase() ===
                              genre.toLowerCase(),
                          ),
                      );

                    if (
                      genreItems.length ===
                      0
                    ) {
                      return null;
                    }

                    return (
                      <CatalogRow
                        key={genre}
                        title={genre}
                        items={genreItems}
                      />
                    );
                  })}


                {/* Recently added */}
                <CatalogRow
                  title="Recently Added"
                  items={items}
                />

              </div>
            )}

        </div>
      </main>


      <SiteFooter />
    </div>
  );
}
