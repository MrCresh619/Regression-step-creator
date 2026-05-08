export const StorageKey = {
  RecorderState: 'recorder-state',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
