import { browser } from 'wxt/browser';

import { initializeMessageRouter } from './messageRouter';

export const startBackgroundWorker = (): void => {
  initializeMessageRouter(browser);
};
