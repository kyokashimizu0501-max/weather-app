import { FavoriteCity } from "@/lib/favorites";

interface Props {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (lat: number, lon: number) => void;
}

export default function FavoritesList({ favorites, onSelect, onRemove }: Props) {
  if (favorites.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {favorites.map((city) => (
        <div
          key={`${city.lat}-${city.lon}`}
          className="flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 shadow"
        >
          <button
            onClick={() => onSelect(city)}
            className="text-white text-sm font-medium hover:text-yellow-200 transition-colors"
          >
            ★ {city.name}
          </button>
          <button
            onClick={() => onRemove(city.lat, city.lon)}
            className="text-white/50 hover:text-white text-xs ml-1 transition-colors"
            aria-label={`${city.name}をお気に入りから削除`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
