"use client";

import { useState, useEffect } from "react";
import { DayForecast, WeatherData } from "@/types/weather";

interface Props {
  data: WeatherData;
  day: DayForecast;
}

interface Advice {
  outfit: string;
  laundry: string;
}

export default function AdviceCard({ data, day }: Props) {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAdvice(null);
    setError("");
    setLoading(true);

    fetch("/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: data.city,
        temp: day.temp,
        feels_like: day.feels_like,
        humidity: day.humidity,
        pop: day.pop,
        wind_speed: day.wind_speed,
        description: day.weather.description,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setAdvice(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [data.city, day.date]);

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 text-white shadow-xl border border-white/20">
      <h3 className="text-sm font-semibold opacity-70 mb-3 flex items-center gap-2">
        <span>✨</span> AI アドバイス
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
          Gemini が考え中...
        </div>
      )}

      {error && !loading && (
        <p className="text-red-300 text-sm">{error}</p>
      )}

      {advice && !loading && (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
            <span className="text-2xl">👗</span>
            <div>
              <p className="text-xs opacity-60 mb-0.5">服装</p>
              <p className="text-sm leading-relaxed">{advice.outfit}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
            <span className="text-2xl">🧺</span>
            <div>
              <p className="text-xs opacity-60 mb-0.5">洗濯</p>
              <p className="text-sm leading-relaxed">{advice.laundry}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
