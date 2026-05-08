import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/globals.css';
import { PopupApp } from './App';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Popup root element was not found.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
