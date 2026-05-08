import { browser } from 'wxt/browser';

import { initializeMessageRouter } from './messageRouter';

export const startBackgroundWorker = async (): Promise<void> => {
  await initializeMessageRouter(browser);
};
