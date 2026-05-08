import localforage from 'localforage';

import type { RecordingState } from '@/shared/types';
import { createInitialRecordingState } from '@/shared/types';
import { StorageKey } from './storageKeys';

const database = localforage.createInstance({
  name: 'regression-test-recorder',
  storeName: 'extension_state',
  description: 'Persistent state for Regression Test Recorder.',
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeRecordingState = (value: unknown): RecordingState | null => {
  if (!isRecord(value) || typeof value.isRecording !== 'boolean') {
    return null;
  }

  const currentSessionId = typeof value.currentSessionId === 'string' ? value.currentSessionId : null;

  return {
    isRecording: value.isRecording,
    isPaused: value.isRecording && typeof value.isPaused === 'boolean' ? value.isPaused : false,
    currentSessionId: value.isRecording ? currentSessionId : null,
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
  };
};

export const getRecordingState = async (): Promise<RecordingState> => {
  const storedState = normalizeRecordingState(await database.getItem<unknown>(StorageKey.RecordingState));

  if (storedState) {
    return storedState;
  }

  const initialState = createInitialRecordingState();
  await database.setItem(StorageKey.RecordingState, initialState);
  return initialState;
};

export const setRecordingState = async (state: RecordingState): Promise<RecordingState> => {
  await database.setItem(StorageKey.RecordingState, state);
  return state;
};

export const getRecorderState = getRecordingState;
export const setRecorderState = setRecordingState;
