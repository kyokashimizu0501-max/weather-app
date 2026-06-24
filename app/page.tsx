"use client";

import { useState } from "react";
import { GeoResult, WeatherData } from "@/types/weather";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeeklyForecast from "@/components/WeeklyForecast";
import ForecastDatePicker from "@/components/ForecastDatePicker";

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchWeather = async (lat: number, lon: number, displayName?: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/weather?action=forecast&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // ユーザーが選択した地名を優先（APIが返す英語名より正確）
      if (displayName) data.city = displayName;
      setWeatherData(data);
      setSelectedDate(data.days[0]?.date ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "天気データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (geo: GeoResult) => {
    const displayName = geo.local_names?.ja ?? geo.name;
    fetchWeather(geo.lat, geo.lon, displayName);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError("位置情報の取得が拒否されました");
        setIsLoading(false);
      }
    );
  };

  const selectedDay = weatherData?.days.find((d) => d.date === selectedDate);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
            天気予報アプリ
          </h1>
          <p className="text-white/70 text-sm mt-1">OpenWeatherMap</p>
        </header>

        <div className="flex justify-center mb-6">
          <SearchBar
            onSelectLocation={handleSelectLocation}
            onUseGeolocation={handleGeolocation}
            isLoading={isLoading}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-500/20 border border-red-300/30 text-white rounded-xl p-4 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {!isLoading && weatherData && selectedDay && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <WeatherCard data={weatherData} day={selectedDay} />
              <WeeklyForecast
                days={weatherData.days}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
            <div className="lg:col-span-1">
              <ForecastDatePicker
                forecastDates={weatherData.days.map((d) => d.date)}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>
        )}

        {!isLoading && !weatherData && !error && (
          <div className="text-center py-20 text-white/60">
            <div className="text-7xl mb-4">🌤</div>
            <p className="text-xl font-light">都市を検索するか、現在地を使ってください</p>
          </div>
        )}
      </div>
    </main>
  );
}
