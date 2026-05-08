export type RecorderStatus = {
  isRecording: boolean;
  activeTabId: number | null;
};

export type RecorderState = RecorderStatus & {
  updatedAt: number;
};

export const createInitialRecorderState = (): RecorderState => ({
  isRecording: false,
  activeTabId: null,
  updatedAt: Date.now(),
});

export const updateRecorderStatus = (
  currentState: RecorderState,
  nextStatus: Partial<RecorderStatus>,
): RecorderState => ({
  ...currentState,
  ...nextStatus,
  updatedAt: Date.now(),
});
