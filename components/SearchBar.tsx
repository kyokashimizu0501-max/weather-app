"use client";

import { useState, useRef, useEffect } from "react";
import { GeoResult } from "@/types/weather";

interface Props {
  onSelectLocation: (geo: GeoResult) => void;
  onUseGeolocation: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onSelectLocation, onUseGeolocation, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError("");
    try {
      const res = await fetch(`/api/weather?action=geocode&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.length === 0) {
        setError("都市が見つかりませんでした");
        setResults([]);
        setShowDropdown(false);
      } else {
        setResults(data);
        setShowDropdown(true);
      }
    } catch {
      setError("検索に失敗しました");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelect = (geo: GeoResult) => {
    const label = geo.local_names?.ja ?? geo.name;
    setQuery(label);
    setShowDropdown(false);
    onSelectLocation(geo);
  };

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="都市名を入力（例: 東京, London）"
            className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          />
          <button
            onClick={handleSearch}
            disabled={searching || isLoading}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium shadow-md transition-colors"
          >
            {searching ? "..." : "検索"}
          </button>
        </div>

        {error && <p className="mt-1 text-sm text-red-200">{error}</p>}

        {showDropdown && results.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {results.map((geo, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(geo)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-800"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">{geo.local_names?.ja ?? geo.name}</span>
                    <span className="text-sm text-gray-500">
                      {geo.local_names?.ja && geo.name !== geo.local_names.ja ? `${geo.name}, ` : ""}
                      {geo.state ? `${geo.state}, ` : ""}
                      {geo.country}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {geo.lat.toFixed(2)}°N, {geo.lon.toFixed(2)}°E
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onUseGeolocation}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-xl font-medium backdrop-blur-sm border border-white/30 shadow-md transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        現在地
      </button>
    </div>
  );
}
