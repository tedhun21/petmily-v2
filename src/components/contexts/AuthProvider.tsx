import { createContext, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import useSWRMutation from 'swr/mutation';

import { poster } from '@/api';
import { setAccessToken } from '@/store/authSlice';

interface ContextProps {
  refreshToken: () => Promise<null>;
}

export const AuthContext = createContext<ContextProps>({
  refreshToken: async () => null,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  const { trigger } = useSWRMutation(`/auth/refresh`, poster);

  const refreshToken = async () => {
    try {
      const { access_token } = await trigger();
      dispatch(setAccessToken(access_token));

      return access_token;
    } catch {
      dispatch(setAccessToken(null));
      return null;
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return <AuthContext.Provider value={{ refreshToken }}>{children}</AuthContext.Provider>;
}
