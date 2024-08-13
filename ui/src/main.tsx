import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { QueryClient, QueryClientProvider } from 'react-query';

const container = document.getElementById('root');
const root = createRoot(container!);
defineCustomElements(window);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </React.StrictMode>
);