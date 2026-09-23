"use client";

import { useEffect, useState } from "react";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import { useGeolocation } from "@/hooks/useGeolocation";

const NAMES: Record<string, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

function fmt(date: Date) {
  return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function PrayerPage() {
  const { coords, status, error, request } = useGeolocation();
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!coords) return;
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CalculationMethod.Dubai();
    setTimes(new PrayerTimes(coordinates, new Date(), params));
  }, [coords]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rows = times
    ? ([
        ["fajr", times.fajr],
        ["sunrise", times.sunrise],
        ["dhuhr", times.dhuhr],
        ["asr", times.asr],
        ["maghrib", times.maghrib],
        ["isha", times.isha],
      ] as const)
    : [];

  const prayerRows = rows.filter(([key]) => key !== "sunrise");

  let nextKey: string | null = null;
  let nextTime: Date | null = null;
  for (const [key, time] of prayerRows) {
    if (time > now) {
      nextKey = key;
      nextTime = time;
      break;
    }
  }
  if (!nextKey && times) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const coordinates = new Coordinates(coords!.lat, coords!.lng);
    const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, CalculationMethod.Dubai());
    nextKey = "fajr";
    nextTime = tomorrowTimes.fajr;
  }

  const remainingMs = nextTime ? Math.max(0, nextTime.getTime() - now.getTime()) : 0;
  const h = Math.floor(remainingMs / 3600000);
  const m = Math.floor((remainingMs % 3600000) / 60000);
  const s = Math.floor((remainingMs % 60000) / 1000);

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          مواقيت الصلاة
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-white/70">
          {now.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>

        {status === "idle" && (
          <button
            type="button"
            onClick={request}
            className="mt-10 rounded-full bg-amber-400 px-9 py-4 text-lg font-bold text-slate-950 shadow-2xl transition hover:scale-105 hover:bg-amber-300"
          >
            حدّد موقعي
          </button>
        )}

        {status === "loading" && (
          <p className="mt-10 text-amber-200">جاري تحديد موقعك…</p>
        )}

        {(status === "denied" || status === "error") && (
          <div className="mt-10 rounded-2xl border border-red-400/40 bg-red-400/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {status === "granted" && times && nextKey && (
          <>
            <div className="mt-10 rounded-3xl border border-amber-300/40 bg-amber-400/10 p-8 shadow-2xl backdrop-blur-md">
              <p className="text-sm text-amber-200/80">الصلاة القادمة</p>
              <p className="mt-2 text-4xl font-bold text-amber-200">{NAMES[nextKey]}</p>
              <p className="mt-1 text-white/60">{fmt(nextTime!)}</p>
              <p className="mt-5 font-mono text-4xl tracking-widest text-amber-300" dir="ltr">
                {pad(h)}:{pad(m)}:{pad(s)}
              </p>
              <p className="mt-2 text-sm text-white/50">المتبقي على الصلاة</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {rows.map(([key, time]) => (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 text-center shadow-lg backdrop-blur-md transition ${
                    key === nextKey
                      ? "border-amber-300 bg-amber-400/15"
                      : "border-white/15 bg-slate-950/60"
                  }`}
                >
                  <p className="text-xs text-white/60">{NAMES[key]}</p>
                  <p className="mt-2 font-bold text-amber-200">{fmt(time)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <a
          href="/"
          className="mt-12 inline-block rounded-full border border-white/30 bg-white/10 px-9 py-3 font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
