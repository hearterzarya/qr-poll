"use client";

import { useCallback, useState } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(async (required = false) => {
    if (!navigator.geolocation) {
      const msg = "Geolocation not supported";
      setError(msg);
      if (required) throw new Error(msg);
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise<{ latitude: number; longitude: number } | null>(
      (resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const c = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };
            setCoords(c);
            setLoading(false);
            resolve(c);
          },
          (err) => {
            const msg = err.message || "Location permission denied";
            setError(msg);
            setLoading(false);
            if (required) resolve(null);
            else resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000 },
        );
      },
    );
  }, []);

  return { coords, error, loading, requestLocation };
}
