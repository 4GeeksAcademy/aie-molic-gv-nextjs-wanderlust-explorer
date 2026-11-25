"use client";

import Link from "next/link";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { experiences } from "@/data/experiences";

export default function FavoritesPage() {
  const { favoriteIds, favoriteCount, removeFavorite } = useFavorites();
  const favorites = experiences.filter((experience) => favoriteIds.includes(experience.id));

  return (
    <section className="page-shell" aria-labelledby="page-title">
      <h1 className="page-title" id="page-title">Tus favoritos</h1>
      <p className="page-description">{favoriteCount} experiencias guardadas durante esta sesión.</p>
      {favorites.length === 0 ? (
        <p className="empty-state">Aún no tienes experiencias favoritas.</p>
      ) : (
        <ul className="foundation-list">
          {favorites.map((experience) => (
            <li key={experience.id}>
              <Link href={`/experiences/${experience.id}`}>{experience.title}</Link>
              <button className="text-button" onClick={() => removeFavorite(experience.id)}>
                Quitar de favoritos
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
