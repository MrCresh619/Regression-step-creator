import React from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/globals.css';
import { SidebarApp } from './App';

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('Sidebar root element was not found.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <SidebarApp />
  </React.StrictMode>,
);
