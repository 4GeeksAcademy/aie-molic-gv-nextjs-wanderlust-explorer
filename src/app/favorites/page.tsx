"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { experiences } from "@/data/experiences";

export default function FavoritesPage() {
  const { favoriteIds, favoriteCount } = useFavorites();
  const favorites = experiences.filter((experience) => favoriteIds.includes(experience.id));

  return (
    <section className="page-shell" aria-labelledby="page-title">
      <div className="favorites-heading">
        <div>
          <h1 className="page-title" id="page-title">Mis favoritos</h1>
          <p className="page-description">Aquí encontrarás las experiencias que has guardado para descubrirlas cuando quieras.</p>
        </div>
        <p className="favorites-count" aria-live="polite">
          <strong>{favoriteCount}</strong> {favoriteCount === 1 ? "experiencia guardada" : "experiencias guardadas"}
        </p>
      </div>
      {favorites.length === 0 ? (
        <div className="explorer-empty favorites-empty">
          <span className="empty-icon"><Heart aria-hidden="true" size={26} /></span>
          <h2>Aún no tienes favoritos</h2>
          <p>Explora nuevas experiencias y guarda las que más te gusten para encontrarlas aquí.</p>
          <Link className="explorer-primary-button favorites-explore-link" href="/experiences">Explorar experiencias</Link>
        </div>
      ) : (
        <div className="experience-grid favorites-grid">
          {favorites.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}
        </div>
      )}
    </section>
  );
}
