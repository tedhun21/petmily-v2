import { createContext } from 'react';

interface ContextProps {
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<ContextProps>({
  refreshToken: async () => null,
});
