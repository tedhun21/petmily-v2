import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import AuthProvider from '@/components/contexts/AuthProvider';
import SocketProvider from '@/components/contexts/SocketProvider';
import ThemeProvider from './components/contexts/ThemeProvider';
import store from '@/store';
import { router } from './routes';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SWRConfig value={{ revalidateOnFocus: false, provider: () => new Map() }}>
        <AuthProvider>
          <SocketProvider>
            <ThemeProvider>
              <RouterProvider router={router} />
            </ThemeProvider>
          </SocketProvider>
        </AuthProvider>
      </SWRConfig>
    </ReduxProvider>
  );
}
