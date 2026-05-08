import { browser } from 'wxt/browser';

import { createSidebarOverlay } from './sidebar/createSidebarOverlay';
import { createPageStepRecorder } from './steps/pageStepRecorder';
import { sendRuntimeMessage } from '@/shared/browser';
import { isExtensionBroadcastMessage, MessageType } from '@/shared/messages';
import type { RecordingState } from '@/shared/types';

let currentRecordingState: RecordingState | null = null;

const sidebarOverlay = createSidebarOverlay();
const pageStepRecorder = createPageStepRecorder();

const applyRecordingState = (state: RecordingState): void => {
  currentRecordingState = state;
  pageStepRecorder.setRecordingState(state);
  sidebarOverlay.updateRecordingState(state);
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
  pageStepRecorder.subscribe((steps) => {
    sidebarOverlay.updateSteps(steps);
  });

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
