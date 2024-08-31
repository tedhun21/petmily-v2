import { useCallback, useState } from 'react';

// Define a simple type for the mutation function
type MutationFn<T> = (variables: T) => Promise<any>;

interface UseCustomMutationProps<T> {
  mutationFn: MutationFn<T>;
  onSuccess?: (data: any) => void;
  onError?: (err: Error) => void;
}

export function useCustomMutation<T>({ mutationFn, onSuccess, onError }: UseCustomMutationProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  // The mutate function triggers the mutation function provided
  const mutate = useCallback(
    async (variables: T) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setData(result);

        if (result && onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        setError(err as Error);
        if (onError) {
          onError(err as Error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn],
  );

  return { mutate, isLoading, error, data };
}
