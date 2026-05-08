import { browser } from 'wxt/browser';

import { sendRuntimeMessage } from '@/shared/browser';
import { isExtensionBroadcastMessage, MessageType } from '@/shared/messages';
import type { RecordingState } from '@/shared/types';

let currentRecordingState: RecordingState | null = null;

const applyRecordingState = (state: RecordingState): void => {
  currentRecordingState = state;
  document.documentElement.dataset.regressionRecorderState = state.isRecording
    ? state.isPaused
      ? 'paused'
      : 'recording'
    : 'stopped';
};

const requestRecordingState = async (): Promise<void> => {
  const result = await sendRuntimeMessage({
    type: MessageType.RecordingStateRequest,
  });

  if (result.ok && result.response?.type === MessageType.RecordingStateResponse) {
    applyRecordingState(result.response.payload);
  }
};

export const getCurrentRecordingState = (): RecordingState | null => currentRecordingState;

export const registerContentScript = (): void => {
  browser.runtime.onMessage.addListener((message: unknown): undefined => {
    if (!isExtensionBroadcastMessage(message)) {
      return undefined;
    }

    applyRecordingState(message.payload);
    return undefined;
  });

  void sendRuntimeMessage({
    type: MessageType.ContentScriptReady,
    payload: {
      url: window.location.href,
      title: document.title,
    },
  });

  void requestRecordingState();
};
