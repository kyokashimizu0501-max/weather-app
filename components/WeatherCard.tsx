import Image from "next/image";
import { DayForecast, WeatherData } from "@/types/weather";
import { getDayLabel, getWeatherIconUrl } from "@/lib/weather";

interface Props {
  data: WeatherData;
  day: DayForecast;
}

export default function WeatherCard({ data, day }: Props) {
  const iconUrl = getWeatherIconUrl(day.weather.icon);

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {data.city}
            <span className="text-lg font-normal ml-2 opacity-75">{data.country}</span>
          </h2>
          <p className="text-white/70 text-sm mt-1">{getDayLabel(day.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70">最高 / 最低</p>
          <p className="text-lg font-semibold">
            {day.temp_max}° / {day.temp_min}°
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 drop-shadow-lg">
          <Image
            src={iconUrl}
            alt={day.weather.description}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div>
          <p className="text-6xl font-thin">{day.temp}°</p>
          <p className="text-lg opacity-80 capitalize">{day.weather.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          }
          label="体感温度"
          value={`${day.feels_like}°C`}
        />
        <StatItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          }
          label="湿度"
          value={`${day.humidity}%`}
        />
        <StatItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
          label="降水確率"
          value={`${day.pop}%`}
        />
        <StatItem
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
          label="風速"
          value={`${day.wind_speed}m/s`}
        />
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
      <div className="opacity-75">{icon}</div>
      <p className="text-xs opacity-70">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
