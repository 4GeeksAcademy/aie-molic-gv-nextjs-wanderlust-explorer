"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { EXPERIENCE_CATEGORIES, EXPERIENCE_CATEGORY_LABELS } from "@/types/experience";

interface ExperienceSearchProps {
  countries: readonly string[];
}

export function ExperienceSearch({ countries }: ExperienceSearchProps) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (destination) params.set("destination", destination);
    const query = params.toString();
    router.push(`/experiences${query ? `?${query}` : ""}`);
  }

  return (
    <form className="home-search" onSubmit={submitSearch} aria-label="Buscar experiencias">
      <label className="search-field">
        <span>Destino</span>
        <select value={destination} onChange={(event) => setDestination(event.target.value)}>
          <option value="">Todos los destinos</option>
          {countries.map((country) => <option key={country} value={country}>{country}</option>)}
        </select>
      </label>
      <label className="search-field">
        <span>Categoría</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas las categorías</option>
          {EXPERIENCE_CATEGORIES.map((value) => (
            <option key={value} value={value}>{EXPERIENCE_CATEGORY_LABELS[value]}</option>
          ))}
        </select>
      </label>
      <button className="search-submit" type="submit">
        <Search aria-hidden="true" size={19} />
        <span>Explorar</span>
      </button>
    </form>
  );
}
