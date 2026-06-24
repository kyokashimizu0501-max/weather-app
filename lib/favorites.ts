"use client";
import { useState, useEffect } from "react";

export interface FavoriteCity {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

const STORAGE_KEY = "weather_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (updated: FavoriteCity[]) => {
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const add = (city: FavoriteCity) => {
    if (favorites.some((f) => f.lat === city.lat && f.lon === city.lon)) return;
    save([...favorites, city]);
  };

  const remove = (lat: number, lon: number) => {
    save(favorites.filter((f) => !(f.lat === lat && f.lon === lon)));
  };

  const isFavorite = (lat: number, lon: number) =>
    favorites.some((f) => f.lat === lat && f.lon === lon);

  return { favorites, add, remove, isFavorite };
}
