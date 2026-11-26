"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";

export function ExperienceFavoriteButton({ experienceId, title, showLabel = false }: { experienceId: string; title: string; showLabel?: boolean }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(experienceId);

  return (
    <button
      className={`experience-favorite${favorite ? " is-favorite" : ""}`}
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? `Guardado en favoritos: ${title}. Quitar de favoritos` : `Guardar en favoritos: ${title}`}
      title={favorite ? "Guardado en favoritos" : "Guardar en favoritos"}
      onClick={() =>
        favorite ? removeFavorite(experienceId) : addFavorite(experienceId)
      }
    >
      <Heart aria-hidden="true" size={20} fill={favorite ? "currentColor" : "none"} />
      {showLabel ? <span>{favorite ? "Guardado en favoritos" : "Guardar en favoritos"}</span> : null}
    </button>
  );
}
