import Image from "next/image";
import { DayForecast } from "@/types/weather";
import { getDayLabel, getWeatherIconUrl } from "@/lib/weather";

interface Props {
  days: DayForecast[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function WeeklyForecast({ days, selectedDate, onSelectDate }: Props) {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 shadow-xl">
      <h3 className="text-sm font-medium opacity-70 mb-3">週間予報</h3>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isSelected
                  ? "bg-white/30 ring-2 ring-white/50 scale-105"
                  : "hover:bg-white/20"
              }`}
            >
              <span className="text-xs font-medium opacity-80">{getDayLabel(day.date)}</span>
              <div className="relative w-10 h-10">
                <Image
                  src={getWeatherIconUrl(day.weather.icon)}
                  alt={day.weather.description}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold">{day.temp_max}°</span>
              <span className="text-xs opacity-60">{day.temp_min}°</span>
              <span className="text-xs opacity-70">{day.pop}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
