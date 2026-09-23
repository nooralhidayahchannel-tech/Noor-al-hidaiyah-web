"use client";

import { useCallback, useState } from "react";

type Coords = { lat: number; lng: number };
type Status = "idle" | "loading" | "granted" | "denied" | "error";

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("جهازك لا يدعم تحديد الموقع");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("granted");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "تم رفض إذن الوصول للموقع، فعّله من إعدادات المتصفح"
            : "تعذّر تحديد موقعك، حاول مرة أخرى"
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 }
    );
  }, []);

  return { coords, status, error, request };
}
