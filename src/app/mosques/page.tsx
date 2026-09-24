"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

type Mosque = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
};

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MosquesPage() {
  const { coords, status, error, request } = useGeolocation();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function findMosques(lat: number, lng: number) {
    setSearching(true);
    setSearchError(null);
    try {
      const query = `[out:json][timeout:20];(node["amenity"="place_of_worship"]["religion"="muslim"](around:4000,${lat},${lng}););out center 40;`;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const list: Mosque[] = (data.elements || [])
        .filter((el: { tags?: { name?: string } }) => el.tags?.name)
        .map((el: { id: number; lat: number; lon: number; tags: { name: string } }) => ({
          id: el.id,
          name: el.tags.name,
          lat: el.lat,
          lng: el.lon,
          distanceKm: distanceKm(lat, lng, el.lat, el.lon),
        }))
        .sort((a: Mosque, b: Mosque) => a.distanceKm - b.distanceKm)
        .slice(0, 15);
      setMosques(list);
      if (list.length === 0) setSearchError("ما لقينا مساجد قريبة مسجّلة بالخرائط بهالمنطقة");
    } catch {
      setSearchError("تعذّر تحميل المساجد القريبة، جرّب مرة ثانية");
    } finally {
      setSearching(false);
    }
  }

  function handleLocate() {
    request();
  }

  useEffect(() => {
    if (status === "granted" && coords) {
      findMosques(coords.lat, coords.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, coords]);

  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.03}%2C${
        coords.lat - 0.02
      }%2C${coords.lng + 0.03}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
    : null;

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          المساجد القريبة
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
          حدّد موقعك لنعرض لك أقرب المساجد المسجّلة بالخرائط
        </p>

        {status === "idle" && (
          <button
            type="button"
            onClick={handleLocate}
            className="mt-10 rounded-full bg-amber-400 px-9 py-4 text-lg font-bold text-slate-950 shadow-2xl transition hover:scale-105 hover:bg-amber-300"
          >
            حدّد موقعي
          </button>
        )}

        {status === "loading" && <p className="mt-10 text-amber-200">جاري تحديد موقعك…</p>}

        {(status === "denied" || status === "error") && (
          <div className="mt-10 rounded-2xl border border-red-400/40 bg-red-400/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {status === "granted" && mapSrc && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            <iframe
              title="خريطة الموقع"
              src={mapSrc}
              className="h-64 w-full sm:h-80"
              loading="lazy"
            />
          </div>
        )}

        {searching && <p className="mt-6 text-amber-200">نبحث عن أقرب المساجد…</p>}
        {searchError && (
          <p className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
            {searchError}
          </p>
        )}

        {mosques.length > 0 && (
          <div className="mt-6 space-y-3 text-right">
            {mosques.map((mosque, index) => (
              <a
                key={mosque.id}
                href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ transitionDelay: `${index * 60}ms` }}
                className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/60 px-5 py-4 shadow-lg backdrop-blur-md transition hover:border-amber-300/40"
              >
                <span className="font-semibold text-white">{mosque.name}</span>
                <span className="text-sm text-amber-300">
                  {mosque.distanceKm.toFixed(1)} كم
                </span>
              </a>
            ))}
          </div>
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
