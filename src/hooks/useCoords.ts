import { useEffect, useState } from 'react';

export default function useCoords() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return { latitude, longitude, error };
}
