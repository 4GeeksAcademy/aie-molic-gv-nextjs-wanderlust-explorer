"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface FavoritesContextValue {
  favoriteIds: readonly string[];
  favoriteCount: number;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const addFavorite = useCallback((id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => current.filter((favoriteId) => favoriteId !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteCount: favoriteIds.length,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favoriteIds, addFavorite, removeFavorite, isFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe utilizarse dentro de FavoritesProvider.");
  }
  return context;
}
