import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天気予報アプリ",
  description: "OpenWeatherMap を使った天気予報 Web アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
