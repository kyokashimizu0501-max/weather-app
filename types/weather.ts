export interface GeoResult {
  name: string;
  local_names?: { ja?: string; en?: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface DayForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  temp: number;
  feels_like: number;
  humidity: number;
  pop: number;
  wind_speed: number;
  weather: WeatherCondition;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  days: DayForecast[];
}
