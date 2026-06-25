import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY が設定されていません" }, { status: 500 });
  }

  const body = await request.json();
  const { city, temp, feels_like, humidity, pop, wind_speed, description } = body;

  const prompt = `
あなたは天気予報アシスタントです。以下の天気情報をもとに、服装と洗濯のアドバイスを日本語で返してください。

【天気情報】
- 都市: ${city}
- 天気: ${description}
- 気温: ${temp}°C（体感温度: ${feels_like}°C）
- 湿度: ${humidity}%
- 降水確率: ${pop}%
- 風速: ${wind_speed}m/s

以下のJSON形式のみで返してください（他のテキストは不要）:
{
  "outfit": "服装アドバイスを60文字以内で",
  "laundry": "洗濯アドバイスを60文字以内で"
}
`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON形式で返ってきませんでした");

    const advice = JSON.parse(jsonMatch[0]);
    return Response.json(advice);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "AIアドバイスの取得に失敗しました" },
      { status: 500 }
    );
  }
}
