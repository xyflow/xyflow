import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App/index';

import '@xyflow/react/dist/style.css';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
