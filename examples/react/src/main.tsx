// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App/index';

import '@xyflow/react/dist/style.css';
import './index.css';

// createRoot(document.getElementById('root') as HTMLElement).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
