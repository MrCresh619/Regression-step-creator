import { create } from 'zustand';

import type { PongMessage, RecorderStatusResponseMessage } from '@/shared/messaging';
import { MessageType } from '@/shared/messaging';
import { sendRuntimeMessage } from '@/shared/browser';

type ConnectionState = 'idle' | 'checking' | 'connected' | 'error';

type PopupState = {
  connectionState: ConnectionState;
  lastBackgroundResponseAt: number | null;
  recorderStatus: RecorderStatusResponseMessage['payload'] | null;
  errorMessage: string | null;
  checkConnection: () => Promise<void>;
  loadRecorderStatus: () => Promise<void>;
};

export const usePopupStore = create<PopupState>((set) => ({
  connectionState: 'idle',
  lastBackgroundResponseAt: null,
  recorderStatus: null,
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

  loadRecorderStatus: async () => {
    const result = await sendRuntimeMessage<RecorderStatusResponseMessage>({
      type: MessageType.RecorderStatusRequest,
    });

    if (!result.ok || result.response?.type !== MessageType.RecorderStatusResponse) {
      set({ errorMessage: result.error ?? 'Unable to load recorder status.' });
      return;
    }

    set({ recorderStatus: result.response.payload, errorMessage: null });
  },
}));
