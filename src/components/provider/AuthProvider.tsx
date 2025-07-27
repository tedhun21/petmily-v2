import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import useSWRMutation from 'swr/mutation';

import { poster } from 'api';
import { setAccessToken } from 'store/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  const { trigger } = useSWRMutation(`/auth/refresh`, poster);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { access_token } = await trigger();
        dispatch(setAccessToken(access_token));
      } catch {
        dispatch(setAccessToken(null));
      }
    };

    initializeAuth();
  }, []);

  return <>{children}</>;
}
