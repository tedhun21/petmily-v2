import { useEffect, useState } from 'react';

type UseCustomQueryOptions<T> = {
  queryFn: () => Promise<T>;
  enabled?: boolean;
  // other options...
};

export function useCustomQuery<T>({ queryFn, enabled }: UseCustomQueryOptions<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (enabled === undefined || enabled === true) {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null); // Reset error state on re-fetch

      queryFn()
        .then((response) => {
          setData(response);
          setIsLoading(false);
          setIsSuccess(true);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
          setIsSuccess(false);
        });
    } else {
      setIsLoading(false); // If not enabled, ensure isLoading is false
    }
  }, [enabled]);

  return { data, isLoading, isSuccess, error };
}
