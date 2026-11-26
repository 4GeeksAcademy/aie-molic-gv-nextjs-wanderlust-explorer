"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CompositionEvent } from "react";
import { Search, X } from "lucide-react";
import { experiences } from "@/data/experiences";
import { EXPERIENCE_CATEGORIES, EXPERIENCE_CATEGORY_LABELS, type ExperienceCategory } from "@/types/experience";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { Footer } from "@/components/layout/Footer";

const PAGE_SIZE = 12;
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const countries: string[] = [...new Set(experiences.map((experience) => experience.destination.country))].sort((a, b) => a.localeCompare(b, "es"));
const categories = EXPERIENCE_CATEGORIES.filter((category) => experiences.some((experience) => experience.category === category));

function single(params: URLSearchParams, key: string) {
  const values = params.getAll(key);
  return values.length === 1 ? values[0] ?? "" : "";
}

export function Explorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const serialized = params.toString();
  const incoming = new URLSearchParams(serialized);
  const rawSearch = single(incoming, "search");
  const rawCategory = single(incoming, "category");
  const rawDestination = single(incoming, "destination");
  const category = categories.includes(rawCategory as ExperienceCategory) ? rawCategory as ExperienceCategory : "";
  const destination = countries.includes(rawDestination) ? rawDestination : "";
  const search = rawSearch.trim();
  const rawPage = single(incoming, "page");
  const requestedPage = /^\d+$/.test(rawPage) && Number(rawPage) > 0 ? Number(rawPage) : 1;
  const [draft, setDraft] = useState(search);
  const composing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef(draft);
  const navigationVersion = useRef(0);

  useEffect(() => {
    navigationVersion.current += 1;
    if (timer.current) clearTimeout(timer.current);
    draftRef.current = search;
    // URL history navigation is an external update that must restore the input draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(search);
  }, [serialized, search]);

  const filtered = useMemo(() => {
    const matcher = search ? new RegExp(escapeRegex(search), "i") : null;
    return experiences.filter((experience) =>
      (!matcher || matcher.test(experience.title)) &&
      (!category || experience.category === category) &&
      (!destination || experience.destination.country === destination),
    );
  }, [search, category, destination]);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const page = pageCount ? Math.min(requestedPage, pageCount) : 1;
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function navigate(next: { search?: string; category?: string; destination?: string; page?: number }, method: "push" | "replace" = "push") {
    const query = new URLSearchParams();
    const nextSearch = (next.search ?? search).trim();
    const nextCategory = next.category ?? category;
    const nextDestination = next.destination ?? destination;
    const nextPage = next.page ?? 1;
    if (nextSearch) query.set("search", nextSearch);
    if (categories.includes(nextCategory as ExperienceCategory)) query.set("category", nextCategory);
    if (countries.includes(nextDestination)) query.set("destination", nextDestination);
    if (nextPage > 1) query.set("page", String(nextPage));
    const href = `${pathname}${query.size ? `?${query.toString()}` : ""}`;
    router[method](href, { scroll: false });
  }

  function onSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    draftRef.current = value;
    setDraft(value);
    if (composing.current) return;
    if (timer.current) clearTimeout(timer.current);
    const version = navigationVersion.current;
    timer.current = setTimeout(() => {
      if (version === navigationVersion.current) navigate({ search: value, page: 1 }, "replace");
    }, 250);
  }

  function onCompositionStart() { composing.current = true; }
  function onCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    composing.current = false;
    draftRef.current = event.currentTarget.value;
    if (timer.current) clearTimeout(timer.current);
    navigate({ search: event.currentTarget.value, page: 1 }, "replace");
  }
  function updateFilter(key: "category" | "destination", value: string) {
    if (timer.current) clearTimeout(timer.current);
    navigate({ search: draftRef.current, [key]: value, page: 1 }, "push");
  }
  function clearAll() {
    if (timer.current) clearTimeout(timer.current);
    setDraft("");
    draftRef.current = "";
    navigate({ search: "", category: "", destination: "", page: 1 }, "push");
  }
  function remove(key: "search" | "category" | "destination") {
    if (key === "search") { setDraft(""); draftRef.current = ""; }
    if (timer.current) clearTimeout(timer.current);
    navigate({ search: key === "search" ? "" : draftRef.current, category: key === "category" ? "" : category, destination: key === "destination" ? "" : destination, page: 1 }, "push");
  }

  return (
    <>
      <section className="explorer-shell" aria-labelledby="explorer-title">
        <header className="explorer-heading"><p className="eyebrow">Wanderlust Explorer · Descubre</p><h1 id="explorer-title" className="page-title">Encuentra tu próxima experiencia</h1><p className="page-description">Explora actividades auténticas y descubre el mundo a tu manera.</p></header>
        <div className="explorer-controls">
          <label className="explorer-search"><span>Buscar por experiencia</span><span className="explorer-input-wrap"><Search aria-hidden="true" size={19} /><input type="search" value={draft} onChange={onSearchChange} onCompositionStart={onCompositionStart} onCompositionEnd={onCompositionEnd} placeholder="¿Qué te gustaría descubrir?" /></span></label>
          <label className="explorer-select"><span>Categoría</span><select value={category} onChange={(event) => updateFilter("category", event.target.value)}><option value="">Todas las categorías</option>{categories.map((value) => <option key={value} value={value}>{EXPERIENCE_CATEGORY_LABELS[value]}</option>)}</select></label>
          <label className="explorer-select"><span>Destino</span><select value={destination} onChange={(event) => updateFilter("destination", event.target.value)}><option value="">Todos los destinos</option>{countries.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        </div>
        {(search || category || destination) && <div className="active-filters" aria-label="Filtros activos"><span>Filtros activos:</span>{search && <button type="button" className="filter-chip" onClick={() => remove("search")}>Búsqueda: {search}<X aria-hidden="true" size={15} /></button>}{category && <button type="button" className="filter-chip" onClick={() => remove("category")}>{EXPERIENCE_CATEGORY_LABELS[category]}<X aria-hidden="true" size={15} /></button>}{destination && <button type="button" className="filter-chip" onClick={() => remove("destination")}>{destination}<X aria-hidden="true" size={15} /></button>}<button type="button" className="clear-filters" onClick={clearAll}>Limpiar filtros</button></div>}
        <section className="explorer-results" aria-label="Resultados de experiencias" aria-live="polite">
          <div className="results-heading"><h2>{filtered.length} {filtered.length === 1 ? "experiencia encontrada" : "experiencias encontradas"}</h2>{filtered.length > 0 && <p>Página {page} de {pageCount}</p>}</div>
          {filtered.length === 0 ? <div className="explorer-empty"><span className="empty-icon"><Search aria-hidden="true" size={25} /></span><h2>No se han encontrado experiencias</h2><p>Prueba con otros términos o ajusta los filtros para descubrir nuevas experiencias.</p><button type="button" className="explorer-primary-button" onClick={clearAll}>Limpiar filtros</button></div> : <><div className="experience-grid">{visible.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}</div>{pageCount > 1 && <nav className="pagination" aria-label="Paginación de experiencias"><button type="button" onClick={() => navigate({ page: page - 1 }, "push")} disabled={page <= 1}>Anterior</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button type="button" key={number} aria-current={number === page ? "page" : undefined} onClick={() => navigate({ page: number }, "push")}>{number}</button>)}<button type="button" onClick={() => navigate({ page: page + 1 }, "push")} disabled={page >= pageCount}>Siguiente</button></nav>}</>}
        </section>
      </section>
      <Footer />
    </>
  );
}
