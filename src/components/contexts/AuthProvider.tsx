import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetcher } from '@/api';
import { AuthContext } from './AuthContext';
import { clearAccessToken, setAccessToken } from '@/store/authSlice';
import useSWR from 'swr';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  const { data, error, mutate } = useSWR(`/auth/refresh`, fetcher, {});

  const refreshToken = async (): Promise<string | null> => {
    try {
      const { access_token } = await mutate();
      dispatch(setAccessToken(access_token));
      return access_token;
    } catch {
      dispatch(clearAccessToken());
      return null;
    }
  };

  useEffect(() => {
    if (data?.access_token) {
      dispatch(setAccessToken(data.access_token));
    } else if (error) {
      dispatch(clearAccessToken());
    }
  }, [data, error, dispatch]);

  return <AuthContext.Provider value={{ refreshToken }}>{children}</AuthContext.Provider>;
}
