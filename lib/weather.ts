import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export function getDayLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "今日";
  if (isTomorrow(date)) return "明日";
  return format(date, "M/d (E)", { locale: ja });
}

export function getDayOfWeek(dateStr: string): string {
  return format(parseISO(dateStr), "E", { locale: ja });
}

export function getMonthDay(dateStr: string): string {
  return format(parseISO(dateStr), "M/d");
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function roundTemp(temp: number): number {
  return Math.round(temp);
}
