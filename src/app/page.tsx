"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Coffee,
  Compass,
  Crosshair,
  Heart,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Place } from "@/lib/places";
import { categories } from "@/lib/places";

const PlacesMap = dynamic(() => import("@/components/PlacesMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#edf0e9]">
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-stone-500 shadow-sm">
        <Compass className="h-4 w-4 animate-pulse text-moss" />
        Finding your map...
      </div>
    </div>
  ),
});

function categoryIcon(category: string) {
  if (category === "Coffee") return <Coffee className="h-3 w-3" />;
  if (category === "Parks") return <span className="text-xs">♧</span>;
  if (category === "Culture") return <span className="text-xs">◈</span>;
  if (category === "Shopping") return <span className="text-xs">◇</span>;
  return <Sparkles className="h-3 w-3" />;
}

function PlaceCard({
  place,
  active,
  saved,
  onSelect,
  onSave,
}: {
  place: Place;
  active: boolean;
  saved: boolean;
  onSelect: () => void;
  onSave: () => void;
}) {
  return (
    <article
      className={`group cursor-pointer overflow-hidden rounded-[15px] border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(40,48,37,.09)] ${active ? "border-moss/45 shadow-[0_8px_25px_rgba(40,48,37,.08)]" : "border-[#eeeee9]"}`}
      onClick={onSelect}
    >
      <div className="relative h-[142px] overflow-hidden">
        <Image
          src={place.image}
          alt={place.name}
          fill
          unoptimized
          sizes="(max-width: 767px) 100vw, 340px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-[#454c41] backdrop-blur">
          {categoryIcon(place.category)}
          {place.category}
        </span>
        <button
          type="button"
          aria-label={saved ? `Remove ${place.name} from saved places` : `Save ${place.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onSave();
          }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/90 text-[#687063] transition hover:scale-105 hover:text-[#b65f5b]"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-[#b65f5b] text-[#b65f5b]" : ""}`} />
        </button>
      </div>
      <div className="p-3.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold tracking-[-.02em] text-[#292e27]">{place.name}</h3>
            <p className="mt-1 text-[11px] text-[#92958d]">{place.neighborhood}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[11px] font-medium text-[#54594f]">
            <Star className="h-3 w-3 fill-[#d7a75a] text-[#d7a75a]" />
            {place.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-2.5 line-clamp-2 text-[11px] leading-[1.6] text-[#777b72]">{place.description}</p>
        <div className="mt-3 flex items-center justify-between border-t border-[#f1f1ec] pt-2.5 text-[10px] text-[#8d9188]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {place.neighborhood}
          </span>
          <span>{place.hours}</span>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<number[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const loadPlaces = useCallback(async (search: string, selectedCategory: string) => {
    try {
      const { getPlaces } = await import("@/lib/places");
      const results = await getPlaces(search, selectedCategory);
      setPlaces(results);
      setApiError("");
      setSelectedPlace((current) =>
        current ? results.find((place) => place.id === current.id) ?? null : null,
      );
    } catch {
      setApiError("We couldn’t reach the places service. Make sure the Python API is running.");
      setPlaces([]);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPlaces(query, category), 180);
    return () => window.clearTimeout(timeout);
  }, [query, category, loadPlaces]);

  const visiblePlaces = useMemo(() => {
    const filtered = showSaved
      ? places.filter((place) => savedPlaces.includes(place.id))
      : places;
    return sortByRating
      ? [...filtered].sort((first, second) => second.rating - first.rating)
      : filtered;
  }, [places, savedPlaces, showSaved, sortByRating]);

  const toggleSaved = (place: Place) => {
    setSavedPlaces((current) =>
      current.includes(place.id)
        ? current.filter((id) => id !== place.id)
        : [...current, place.id],
    );
  };

  const handleSort = () => setSortByRating((current) => !current);

  return (
    <main className="flex h-[100dvh] min-h-[620px] flex-col overflow-hidden bg-canvas">
      <header className="relative z-20 flex h-[68px] shrink-0 items-center justify-between border-b border-[#edede7] bg-[#fbfbf8] px-5 md:px-8">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2.5" aria-label="Atlas home">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-[11px] bg-[#58754d] text-white">
              <Compass className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
            <span className="text-[20px] font-semibold tracking-[-.075em] text-[#283126]">atlas<span className="text-[#71846a]">.</span></span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            <button className="rounded-full bg-[#eef1e9] px-4 py-2 text-[12px] font-medium text-[#41523d]">Explore</button>
            <button
              onClick={() => {
                setShowSaved((current) => !current);
                setQuery("");
                setCategory("All");
              }}
              className={`rounded-full px-4 py-2 text-[12px] font-medium transition hover:bg-[#f1f2ed] ${showSaved ? "bg-[#eef1e9] text-[#41523d]" : "text-[#858a80]"}`}
            >
              Saved places{savedPlaces.length > 0 ? ` (${savedPlaces.length})` : ""}
            </button>
            <button className="rounded-full px-4 py-2 text-[12px] font-medium text-[#858a80] transition hover:bg-[#f1f2ed]">About</button>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-[#ecece6] bg-white px-3 py-[7px] text-[11px] text-[#74796f] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#87a27c]" />
            New York, NY
            <ChevronDown className="ml-1 h-3 w-3" />
          </span>
          <button className="hidden items-center gap-2 rounded-full bg-[#293c2a] px-4 py-[9px] text-[11px] font-medium text-white transition hover:bg-[#3d5940] sm:flex">
            <Plus className="h-3.5 w-3.5" />
            Add a place
          </button>
          <button aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-full border border-[#ecece6] text-[#5f665a] sm:hidden">
            <Menu className="h-4 w-4" />
          </button>
          <button aria-label="Your profile" className="grid h-9 w-9 place-items-center rounded-full bg-[#eee8db] text-[11px] font-semibold text-[#786e5e]">T</button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <aside className={`${mobileListOpen ? "flex" : "hidden"} absolute inset-0 z-10 w-full flex-col overflow-hidden bg-[#fafaf7] md:relative md:flex md:w-[390px] md:shrink-0 md:border-r md:border-[#edede7] xl:w-[410px]`}>
          <div className="shrink-0 px-5 pb-3 pt-6 md:px-6 md:pt-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#96998f]">A little local knowledge</p>
                <h1 className="text-[25px] font-semibold leading-tight tracking-[-.055em] text-[#272d25]">Find your somewhere.</h1>
              </div>
              <button aria-label="Close places" onClick={() => setMobileListOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-[#e9eae3] bg-white md:hidden">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 max-w-[320px] text-[12px] leading-[1.7] text-[#82867d]">Good coffee, quiet corners, places you’ll want to tell your friends about.</p>
            <label className="flex h-[43px] items-center gap-2.5 rounded-[10px] border border-[#e8e9e2] bg-white px-3.5 transition focus-within:border-[#a6b39d] focus-within:shadow-[0_0_0_3px_rgba(99,126,86,.08)]">
              <Search className="h-4 w-4 shrink-0 text-[#93978e]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search places, neighborhoods..."
                maxLength={100}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#30352d] outline-none placeholder:text-[#aaaDA5]"
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")} className="text-[#999d94] hover:text-[#454b41]">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="hidden rounded border border-[#ebebe6] bg-[#fafaf8] px-1.5 py-0.5 text-[9px] text-[#a2a59d] sm:inline">⌘ K</span>
            </label>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCategory(item.name)}
                  className={`flex h-[31px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[10px] font-medium transition ${category === item.name ? "border-[#52684b] bg-[#52684b] text-white" : "border-[#e9eae3] bg-white text-[#73786e] hover:border-[#bac6b3] hover:text-[#465940]"}`}
                >
                  <span className="text-[11px]">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#edede8] pt-4">
              <p className="text-[11px] text-[#858980]">
                <span className="font-semibold text-[#3f473c]">{showSaved ? visiblePlaces.length : places.length}</span>
                {" "}{showSaved ? "saved nearby" : "lovely places nearby"}
              </p>
              <button
                onClick={handleSort}
                className="flex items-center gap-1.5 text-[10px] font-medium text-[#7f847b] transition hover:text-[#40523b]"
              >
                <ArrowDownUp className="h-3 w-3" />
                {sortByRating ? "Top rated" : "For you"}
                <SlidersHorizontal className="ml-1 h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-6">
            {apiError ? (
              <div className="mt-3 rounded-xl border border-[#eedbd2] bg-[#fff9f5] p-4">
                <p className="text-[12px] font-medium text-[#8d5542]">Places are unavailable</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#9a7569]">{apiError}</p>
              </div>
            ) : visiblePlaces.length > 0 ? (
              <div className="grid gap-3">
                {visiblePlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    active={selectedPlace?.id === place.id}
                    saved={savedPlaces.includes(place.id)}
                    onSelect={() => {
                      setSelectedPlace(place);
                      setMobileListOpen(false);
                    }}
                    onSave={() => toggleSaved(place)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eef1e9] text-[#62795a]">
                  {showSaved ? <Bookmark className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </span>
                <h2 className="mt-3 text-[13px] font-medium text-[#41473e]">
                  {showSaved ? "Nothing saved just yet" : "No places found"}
                </h2>
                <p className="mt-1 max-w-[210px] text-[11px] leading-relaxed text-[#8d9188]">
                  {showSaved ? "Tap the heart on a place to keep it close." : "Try a different search or category."}
                </p>
                {showSaved && (
                  <button onClick={() => setShowSaved(false)} className="mt-3 text-[11px] font-medium text-moss">
                    Explore places
                  </button>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center justify-center gap-1.5 py-2 text-[9px] text-[#a2a59d]">
              <Sparkles className="h-3 w-3" />
              Made for the curious, not the crowds.
            </div>
          </div>
        </aside>

        <section className="relative min-w-0 flex-1 overflow-hidden" aria-label="Map of nearby places">
          <PlacesMap
            places={visiblePlaces}
            selectedPlace={selectedPlace}
            onSelect={setSelectedPlace}
          />
          <div className="absolute left-4 top-4 z-[400] hidden items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3.5 py-2.5 shadow-[0_2px_12px_rgba(35,42,32,.09)] backdrop-blur sm:flex">
            <MapPin className="h-3.5 w-3.5 text-moss" />
            <span className="text-[11px] font-medium text-[#42483e]">Downtown Manhattan</span>
            <span className="mx-0.5 h-3 w-px bg-[#e9e9e3]" />
            <span className="text-[10px] text-[#8c9087]">{visiblePlaces.length} places</span>
          </div>
          <button
            onClick={() => setMobileListOpen(true)}
            className="absolute left-4 top-4 z-[400] flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3.5 py-2.5 text-[11px] font-medium text-[#42483e] shadow-[0_2px_12px_rgba(35,42,32,.09)] backdrop-blur sm:hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Explore places
            <span className="rounded-full bg-[#eef1e9] px-1.5 py-0.5 text-[9px] text-[#52684b]">{visiblePlaces.length}</span>
          </button>
          <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
            <button aria-label="Zoom in" onClick={() => window.dispatchEvent(new Event("atlas-zoom-in"))} className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/70 bg-white/95 text-[#555c51] shadow-[0_2px_12px_rgba(35,42,32,.09)] transition hover:bg-white">
              <Plus className="h-4 w-4" />
            </button>
            <button aria-label="Zoom out" onClick={() => window.dispatchEvent(new Event("atlas-zoom-out"))} className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/70 bg-white/95 text-[#555c51] shadow-[0_2px_12px_rgba(35,42,32,.09)] transition hover:bg-white">
              <Minus className="h-4 w-4" />
            </button>
            <button
              aria-label="Center map on New York"
              onClick={() => {
                setSelectedPlace(null);
                window.dispatchEvent(new Event("atlas-recenter"));
              }}
              className="mt-1 grid h-9 w-9 place-items-center rounded-[10px] border border-white/70 bg-white/95 text-[#555c51] shadow-[0_2px_12px_rgba(35,42,32,.09)] transition hover:bg-white"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-5 left-4 z-[400] flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3 py-2 shadow-[0_2px_12px_rgba(35,42,32,.08)] backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eef1e9] text-[11px] text-moss">✳</span>
            <span className="text-[10px] text-[#71776d]">Good things are just around the corner.</span>
          </div>
          <button className="absolute bottom-5 right-4 z-[400] hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-2 text-[10px] text-[#73796e] shadow-[0_2px_12px_rgba(35,42,32,.08)] backdrop-blur transition hover:text-[#40523b] lg:flex">
            <Check className="h-3 w-3 text-moss" />
            Map view
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </section>
      </div>
    </main>
  );
}
