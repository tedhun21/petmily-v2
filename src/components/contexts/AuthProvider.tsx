import { useEffect, createContext } from 'react';

import useSWR from 'swr';
import { useDispatch } from 'react-redux';

import { fetcher } from '@/api';
import { clearAccessToken, setAccessToken } from '@/store/slices/authSlice';

interface ContextProps {
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<ContextProps>({
  refreshToken: async () => null,
});

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
