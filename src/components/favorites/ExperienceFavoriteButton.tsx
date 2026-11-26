"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";

export function ExperienceFavoriteButton({ experienceId, title }: { experienceId: string; title: string }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(experienceId);

  return (
    <button
      className={`experience-favorite${favorite ? " is-favorite" : ""}`}
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? `Quitar ${title} de favoritos` : `Añadir ${title} a favoritos`}
      onClick={() =>
        favorite ? removeFavorite(experienceId) : addFavorite(experienceId)
      }
    >
      <Heart aria-hidden="true" size={20} fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}
