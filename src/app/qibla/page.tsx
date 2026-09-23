"use client";

import { useEffect, useRef, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

const KAABA = { lat: 21.4225, lng: 39.8262 };

function qiblaBearing(lat: number, lng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const phiK = toRad(KAABA.lat);
  const lambdaK = toRad(KAABA.lng);
  const phi = toRad(lat);
  const lambda = toRad(lng);
  const dLambda = lambdaK - lambda;

  const y = Math.sin(dLambda) * Math.cos(phiK);
  const x =
    Math.cos(phi) * Math.sin(phiK) -
    Math.sin(phi) * Math.cos(phiK) * Math.cos(dLambda);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function QiblaPage() {
  const { coords, status, error, request } = useGeolocation();
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [compassReady, setCompassReady] = useState(false);
  const headingHandler = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  useEffect(() => {
    if (coords) setBearing(qiblaBearing(coords.lat, coords.lng));
  }, [coords]);

  function handleOrientation(e: DeviceOrientationEvent) {
    const webkitEvent = e as DeviceOrientationEvent & {
      webkitCompassHeading?: number;
    };
    if (typeof webkitEvent.webkitCompassHeading === "number") {
      setHeading(webkitEvent.webkitCompassHeading);
    } else if (e.alpha !== null) {
      setHeading(360 - e.alpha);
    }
  }

  async function enableCompass() {
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    try {
      if (typeof DOE?.requestPermission === "function") {
        const result = await DOE.requestPermission();
        if (result !== "granted") return;
      }
      headingHandler.current = handleOrientation;
      window.addEventListener(
        "deviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation",
        headingHandler.current as EventListener
      );
      setCompassReady(true);
    } catch {
      // sensor not available — static bearing still shown
    }
  }

  useEffect(() => {
    return () => {
      if (headingHandler.current) {
        window.removeEventListener("deviceorientation", headingHandler.current as EventListener);
        window.removeEventListener("deviceorientationabsolute", headingHandler.current as EventListener);
      }
    };
  }, []);

  const needleRotation =
    bearing !== null ? bearing - (compassReady && heading !== null ? heading : 0) : 0;

  return (
    <main dir="rtl" className="min-h-screen bg-[#062b1f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-amber-300">
          NOOR AL-HIDAYAH
        </p>
        <h1 className="mt-4 text-4xl font-bold text-amber-100 sm:text-6xl">
          اتجاه القبلة
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-white/70">
          حدّد موقعك لمعرفة اتجاه الكعبة المشرفة من مكانك
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

        {status === "granted" && bearing !== null && (
          <div className="mt-10 rounded-3xl border border-white/20 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-md">
            <div className="relative mx-auto h-64 w-64">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <circle cx="100" cy="100" r="94" fill="none" stroke="#fbbf24" strokeOpacity=".35" strokeWidth="2" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#fbbf24" strokeOpacity=".2" strokeWidth="1" />
                {["N", "E", "S", "W"].map((label, i) => {
                  const angle = i * 90;
                  const rad = (angle * Math.PI) / 180;
                  const x = 100 + 82 * Math.sin(rad);
                  const y = 100 - 82 * Math.cos(rad);
                  return (
                    <text
                      key={label}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fde68a"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>

              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <polygon points="100,20 88,100 100,90 112,100" fill="#fbbf24" />
                  <polygon points="100,180 88,100 100,110 112,100" fill="#ffffff33" />
                  <circle cx="100" cy="100" r="7" fill="#fbbf24" />
                </svg>
              </div>
            </div>

            <p className="mt-6 text-2xl font-bold text-amber-200">
              {Math.round(bearing)}° من الشمال
            </p>

            {!compassReady ? (
              <button
                type="button"
                onClick={enableCompass}
                className="mt-5 rounded-full border border-amber-300/50 bg-amber-400/10 px-6 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20"
              >
                تفعيل البوصلة الحية 🧭
              </button>
            ) : (
              <p className="mt-5 text-sm text-white/60">
                وجّه هاتفك، السهم الذهبي يشير للكعبة المشرفة
              </p>
            )}
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
