"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";

export function ExperienceFavoriteButton({ experienceId }: { experienceId: string }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(experienceId);

  return (
    <button
      className="text-button favorite-toggle"
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      onClick={() =>
        favorite ? removeFavorite(experienceId) : addFavorite(experienceId)
      }
    >
      <Heart aria-hidden="true" size={18} fill={favorite ? "currentColor" : "none"} />
      {favorite ? "En favoritos" : "Añadir a favoritos"}
    </button>
  );
}
