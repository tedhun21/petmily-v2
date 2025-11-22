import * as ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </HelmetProvider>
  </>,
);
