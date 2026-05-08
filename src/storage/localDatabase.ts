import localforage from 'localforage';

import type { RecorderState } from '@/core/recorder';
import { createInitialRecorderState } from '@/core/recorder';
import { StorageKey } from './storageKeys';

const database = localforage.createInstance({
  name: 'regression-test-recorder',
  storeName: 'extension_state',
  description: 'Persistent state for Regression Test Recorder.',
});

export const getRecorderState = async (): Promise<RecorderState> => {
  const storedState = await database.getItem<RecorderState>(StorageKey.RecorderState);

  if (storedState) {
    return storedState;
  }

  const initialState = createInitialRecorderState();
  await database.setItem(StorageKey.RecorderState, initialState);
  return initialState;
};

export const setRecorderState = async (state: RecorderState): Promise<RecorderState> => {
  await database.setItem(StorageKey.RecorderState, state);
  return state;
};
