import useSWR from 'swr';
import { SWRConfiguration, SWRResponse } from 'swr/_internal';
import useSWRMutation from 'swr/mutation';
import useSWRInfinite from 'swr/infinite';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useAuthSWR = <T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  config?: SWRConfiguration<T>,
): SWRResponse<T> => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const guardedKey = accessToken ? key : null;

  return useSWR(guardedKey, fetcher, config);
};

export const useAuthSWRMutation = <T, Arg = any>(
  key: string | null,
  mutationFn: (url: string, options: { arg: Arg }) => Promise<T>,
  config?: any,
) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const guardedKey = accessToken ? key : null;

  return useSWRMutation(guardedKey, mutationFn, config);
};

export const useAuthSWRInfinite = <T>(
  getKeyFn: (pageIndex: number, previousPageData: any) => string | null,
  fetcher: (url: string) => Promise<T>,
  config?: any,
) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const guardedGetKey = (pageIndex: number, previousPageData: any) => {
    if (!accessToken) return null;
    return getKeyFn(pageIndex, previousPageData);
  };

  return useSWRInfinite(guardedGetKey, fetcher, config);
};
