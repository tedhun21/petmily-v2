import { useEffect, useState } from 'react';

export default function useCoords() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (geoError) => {
          setError(geoError.message);
        },
      );
    }
  }, []);

  return { latitude, longitude, error };
}
