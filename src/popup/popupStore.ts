import { create } from 'zustand';

import { sendRuntimeMessage } from '@/shared/browser';
import type { PongMessage, RecordingStateResponseMessage } from '@/shared/messages';
import { MessageType } from '@/shared/messages';
import type { RecordingCommand, RecordingState } from '@/shared/types';

type ConnectionState = 'idle' | 'checking' | 'connected' | 'error';
type RecorderActionState = 'idle' | 'updating';

type PopupState = {
  connectionState: ConnectionState;
  actionState: RecorderActionState;
  lastBackgroundResponseAt: number | null;
  recordingState: RecordingState | null;
  errorMessage: string | null;
  checkConnection: () => Promise<void>;
  loadRecordingState: () => Promise<void>;
  dispatchRecordingCommand: (command: RecordingCommand) => Promise<void>;
};

const recordingStateFallback: RecordingState = {
  isRecording: false,
  isPaused: false,
  currentSessionId: null,
  updatedAt: 0,
};

export const usePopupStore = create<PopupState>((set) => ({
  connectionState: 'idle',
  actionState: 'idle',
  lastBackgroundResponseAt: null,
  recordingState: null,
  errorMessage: null,

  checkConnection: async () => {
    set({ connectionState: 'checking', errorMessage: null });

    const result = await sendRuntimeMessage<PongMessage>({
      type: MessageType.Ping,
      payload: {
        source: 'popup',
        sentAt: Date.now(),
      },
    });

    if (!result.ok || result.response?.type !== MessageType.Pong) {
      set({
        connectionState: 'error',
        errorMessage: result.error ?? 'Background worker did not respond.',
      });
      return;
    }

    set({
      connectionState: 'connected',
      lastBackgroundResponseAt: result.response.payload.receivedAt,
      errorMessage: null,
    });
  },

  loadRecordingState: async () => {
    const result = await sendRuntimeMessage<RecordingStateResponseMessage>({
      type: MessageType.RecordingStateRequest,
    });

    if (!result.ok || result.response?.type !== MessageType.RecordingStateResponse) {
      set({ errorMessage: result.error ?? 'Unable to load recording state.' });
      return;
    }

    set({ recordingState: result.response.payload, errorMessage: null });
  },

  dispatchRecordingCommand: async (command: RecordingCommand) => {
    set({ actionState: 'updating', errorMessage: null });

    const result = await sendRuntimeMessage<RecordingStateResponseMessage>({
      type: MessageType.RecordingCommandRequest,
      payload: { command },
    });

    if (!result.ok || result.response?.type !== MessageType.RecordingStateResponse) {
      set({
        actionState: 'idle',
        errorMessage: result.error ?? `Unable to ${command} recording.`,
      });
      return;
    }

    set({
      actionState: 'idle',
      recordingState: result.response.payload,
      errorMessage: null,
    });
  },
}));

export const selectRecordingState = (state: PopupState): RecordingState =>
  state.recordingState ?? recordingStateFallback;
