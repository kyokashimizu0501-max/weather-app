import { NextRequest } from "next/server";
import { DayForecast } from "@/types/weather";

interface OWMForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  wind: { speed: number };
  pop: number;
  dt_txt: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return Response.json({ error: "API キーが設定されていません" }, { status: 500 });
  }

  try {
    if (action === "geocode") {
      const q = searchParams.get("q");
      if (!q) return Response.json({ error: "検索クエリが必要です" }, { status: 400 });

      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`,
        { next: { revalidate: 300 } }
      );
      if (res.status === 401) return Response.json({ error: "API キーが無効です。OpenWeatherMap で発行後、アクティブになるまで最大2〜3時間かかります。" }, { status: 401 });
      if (!res.ok) throw new Error("Geocoding API error");
      const data = await res.json();
      return Response.json(data);
    }

    if (action === "forecast") {
      const lat = searchParams.get("lat");
      const lon = searchParams.get("lon");
      if (!lat || !lon) return Response.json({ error: "緯度・経度が必要です" }, { status: 400 });

      const [forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`,
          { next: { revalidate: 600 } }
        ),
      ]);

      if (forecastRes.status === 401) return Response.json({ error: "API キーが無効です。OpenWeatherMap で発行後、アクティブになるまで最大2〜3時間かかります。" }, { status: 401 });
      if (!forecastRes.ok) throw new Error("Forecast API error");
      const forecastData = await forecastRes.json();

      const groupedByDay: Record<string, OWMForecastItem[]> = {};
      for (const item of forecastData.list as OWMForecastItem[]) {
        const date = item.dt_txt.split(" ")[0];
        if (!groupedByDay[date]) groupedByDay[date] = [];
        groupedByDay[date].push(item);
      }

      const days: DayForecast[] = Object.entries(groupedByDay).map(([date, items]) => {
        const noonItem =
          items.find((i) => i.dt_txt.includes("12:00:00")) ?? items[Math.floor(items.length / 2)];
        return {
          date,
          temp_max: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
          temp_min: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
          temp: Math.round(noonItem.main.temp),
          feels_like: Math.round(noonItem.main.feels_like),
          humidity: Math.round(noonItem.main.humidity),
          pop: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
          wind_speed: Math.round(noonItem.wind.speed * 10) / 10,
          weather: noonItem.weather[0],
        };
      });

      return Response.json({
        city: forecastData.city.name,
        country: forecastData.city.country,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        days,
      });
    }

    return Response.json({ error: "不明なアクション" }, { status: 400 });
  } catch {
    return Response.json({ error: "天気データの取得に失敗しました" }, { status: 500 });
  }
}
