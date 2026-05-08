export type RecordingSessionId = string;

export type RecordingState = {
  isRecording: boolean;
  isPaused: boolean;
  currentSessionId: RecordingSessionId | null;
  updatedAt: number;
};

export type RecordingCommand = 'start' | 'stop' | 'pause' | 'resume';

export const createInitialRecordingState = (): RecordingState => ({
  isRecording: false,
  isPaused: false,
  currentSessionId: null,
  updatedAt: Date.now(),
});

export const createRecordingSessionId = (): RecordingSessionId => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
