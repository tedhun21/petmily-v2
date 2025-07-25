import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from 'store/authSlice';
import { RootState } from 'store';
import { poster } from 'api';
import useSWRMutation from 'swr/mutation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const { trigger } = useSWRMutation(`/auth/refresh`, poster);

  useEffect(() => {
    if (accessToken) return; // 이미 있으면 refresh 안 함

    const refreshToken = async () => {
      try {
        const { access_token } = await trigger();

        dispatch(setAccessToken(access_token || null));
      } catch {
        dispatch(setAccessToken(null));
      }
    };

    refreshToken();
  }, []);

  return <>{children}</>;
}
