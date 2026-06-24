"use client";

import { DayPicker } from "react-day-picker";
import { parseISO } from "date-fns";
import { ja } from "date-fns/locale";

interface Props {
  forecastDates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function ForecastDatePicker({ forecastDates, selectedDate, onSelectDate }: Props) {
  const availableDates = forecastDates.map((d) => parseISO(d));
  const selected = parseISO(selectedDate);

  const isDisabled = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return !forecastDates.includes(dateStr);
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const dateStr = date.toISOString().split("T")[0];
    if (forecastDates.includes(dateStr)) {
      onSelectDate(dateStr);
    }
  };

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 shadow-xl">
      <h3 className="text-sm font-medium opacity-70 mb-2">カレンダー</h3>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        disabled={isDisabled}
        defaultMonth={availableDates[0]}
        locale={ja}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          month_caption: "flex justify-center items-center mb-2",
          caption_label: "text-sm font-medium text-white",
          nav: "flex items-center justify-between w-full absolute top-0",
          button_previous: "text-white/70 hover:text-white p-1 rounded transition-colors",
          button_next: "text-white/70 hover:text-white p-1 rounded transition-colors",
          month_grid: "w-full",
          weekdays: "grid grid-cols-7 mb-1",
          weekday: "text-center text-xs text-white/50 py-1",
          weeks: "w-full",
          week: "grid grid-cols-7",
          day: "flex items-center justify-center",
          day_button:
            "w-8 h-8 text-sm rounded-full transition-all hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed",
          selected: "!bg-white/40 font-bold ring-2 ring-white/50",
          today: "text-yellow-300 font-bold",
          outside: "opacity-0 pointer-events-none",
        }}
      />
    </div>
  );
}
