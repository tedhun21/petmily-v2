import useSWR from 'swr';
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation';
import useSWRInfinite, { type SWRInfiniteConfiguration } from 'swr/infinite';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const useAuthSWR = <T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  config?: SWRConfiguration<T>,
): SWRResponse<T> => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const guardedKey = accessToken ? key : null;

  return useSWR(guardedKey, fetcher, config);
};

export const useAuthSWRMutation = <T, Arg>(
  key: string | null,
  mutationFn: (url: string, options: { arg: Arg }) => Promise<T>,
  config?: SWRMutationConfiguration<T, Error, string | null, Arg>,
) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const guardedKey = accessToken ? key : null;

  return useSWRMutation<T, Error, string | null, Arg>(guardedKey, mutationFn, config);
};

export const useAuthSWRInfinite = <T>(
  getKeyFn: (pageIndex: number, previousPageData: T | null) => string | null,
  fetcher: (url: string) => Promise<T>,
  config?: SWRInfiniteConfiguration<T, Error>,
) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const guardedGetKey = (pageIndex: number, previousPageData: T | null) => {
    if (!accessToken) return null;
    return getKeyFn(pageIndex, previousPageData);
  };

  return useSWRInfinite(guardedGetKey, fetcher, config);
};
