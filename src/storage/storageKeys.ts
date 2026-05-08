export const StorageKey = {
  RecordingState: 'recorder-state',
  RecorderState: 'recorder-state',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
