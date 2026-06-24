"use client";

interface Props {
  weatherMain: string;
}

// sin ベースのハッシュ：連番シードでも 0〜1 に均等分散する
function pr(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

type WeatherType = "clear" | "clouds" | "rain" | "snow" | "storm";

function classify(main: string): WeatherType {
  const m = main.toLowerCase();
  if (m === "clear") return "clear";
  if (m === "snow") return "snow";
  if (m === "thunderstorm") return "storm";
  if (m === "rain" || m === "drizzle") return "rain";
  return "clouds";
}

function Rain({ count = 70 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const dur = 0.7 + pr(i * 7) * 0.8;
        const negDelay = -(pr(i * 11) * dur);
        return (
          <div
            key={i}
            className="absolute bg-blue-100/80"
            style={{
              left: `${pr(i * 3) * 100}%`,
              top: 0,
              width: "1.5px",
              height: `${16 + pr(i * 3 + 2) * 20}px`,
              borderRadius: "0 0 2px 2px",
              animation: `rain-drop ${dur}s ${negDelay}s linear infinite`,
            }}
          />
        );
      })}
    </>
  );
}

function Snow() {
  return (
    <>
      {Array.from({ length: 55 }, (_, i) => {
        const size = 4 + pr(i * 5 + 2) * 10;
        const dur = 2.5 + pr(i * 9) * 3;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${pr(i * 5) * 100}%`,
              top: 0,
              width: `${size}px`,
              height: `${size}px`,
              animation: `snow-fall ${dur}s ${-(pr(i * 13) * dur)}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </>
  );
}

function Sun() {
  const rays = 12;
  // 太陽の中心を左上に配置
  const cx = 90;
  const cy = 90;

  return (
    <>
      {/* 光の粒子は左上エリアに集中 */}
      {Array.from({ length: 20 }, (_, i) => {
        const dur = 2 + pr(i * 7) * 3;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-200"
            style={{
              left: `${pr(i * 3) * 40}%`,
              bottom: `${pr(i * 3 + 1) * 70}%`,
              width: `${3 + pr(i * 3 + 2) * 5}px`,
              height: `${3 + pr(i * 3 + 2) * 5}px`,
              animation: `particle-rise ${dur}s ${-(pr(i * 11) * dur)}s ease-out infinite`,
            }}
          />
        );
      })}

      {/* 回転する光線リング（左上中心） */}
      <div
        className="absolute"
        style={{
          left: `${cx - 110}px`,
          top: `${cy - 110}px`,
          width: "220px",
          height: "220px",
          animation: "sun-spin 12s linear infinite",
        }}
      >
        {Array.from({ length: rays }, (_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-300/50 rounded-full"
            style={{
              width: "4px",
              height: "90px",
              left: "50%",
              top: "50%",
              marginLeft: "-2px",
              marginTop: "-45px",
              transformOrigin: "center center",
              transform: `rotate(${(360 / rays) * i}deg) translateY(-105px)`,
            }}
          />
        ))}
      </div>

      {/* 太陽本体（左上） */}
      <div
        className="absolute rounded-full bg-yellow-300"
        style={{
          left: `${cx - 55}px`,
          top: `${cy - 55}px`,
          width: "110px",
          height: "110px",
          boxShadow: "0 0 80px 30px rgba(253,224,71,0.6)",
          animation: "sun-pulse 3s ease-in-out infinite",
        }}
      />
    </>
  );
}

function Clouds() {
  const cloudData = [
    { w: 260, h: 80, top: "10%", dur: 22, negDelay: -5  },
    { w: 180, h: 60, top: "35%", dur: 30, negDelay: -12 },
    { w: 320, h: 90, top: "55%", dur: 18, negDelay: -3  },
    { w: 200, h: 65, top: "70%", dur: 26, negDelay: -18 },
    { w: 140, h: 50, top: "20%", dur: 34, negDelay: -7  },
    { w: 280, h: 75, top: "60%", dur: 20, negDelay: -14 },
  ];

  return (
    <>
      {cloudData.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top,
            left: "-350px",
            width: `${c.w}px`,
            height: `${c.h}px`,
            animation: `cloud-float ${c.dur}s ${c.negDelay}s linear infinite`,
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/80 rounded-full" />
          <div
            className="absolute bg-white/80 rounded-full"
            style={{ width: "55%", height: "80%", bottom: "20%", left: "15%" }}
          />
          <div
            className="absolute bg-white/80 rounded-full"
            style={{ width: "45%", height: "70%", bottom: "20%", left: "40%" }}
          />
        </div>
      ))}
    </>
  );
}

function Lightning() {
  return (
    <div
      className="absolute inset-0 bg-white/30"
      style={{ animation: "lightning-flash 4s 1s ease-in-out infinite" }}
    />
  );
}

const BG: Record<WeatherType, string> = {
  clear:  "from-amber-300 via-orange-300 to-yellow-200",
  clouds: "from-slate-500 via-gray-400 to-slate-400",
  rain:   "from-slate-700 via-blue-800 to-slate-600",
  snow:   "from-blue-900 via-indigo-800 to-slate-700",
  storm:  "from-gray-900 via-purple-900 to-slate-800",
};

export default function WeatherAnimation({ weatherMain }: Props) {
  const type = classify(weatherMain);

  return (
    <div
      className={`fixed inset-0 overflow-hidden bg-gradient-to-b ${BG[type]}`}
      style={{ zIndex: -10 }}
    >
      {type === "rain"   && <Rain count={70} />}
      {type === "storm"  && <><Rain count={110} /><Lightning /></>}
      {type === "snow"   && <Snow />}
      {type === "clear"  && <Sun />}
      {type === "clouds" && <Clouds />}
    </div>
  );
}
