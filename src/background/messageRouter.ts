import type { browser } from 'wxt/browser';

import type { RecordingStore } from './store';
import { createRecordingStore } from './store';
import type { ExtensionRequestMessage, ExtensionResponseMessage } from '@/shared/messages';
import { isExtensionRequestMessage, MessageType } from '@/shared/messages';

type BrowserRuntime = Pick<typeof browser, 'runtime'>;
type BrowserTabs = Pick<typeof browser, 'tabs'>;
type BrowserApi = BrowserRuntime & BrowserTabs;
type RuntimeMessageSender = Parameters<typeof browser.runtime.onMessage.addListener>[0] extends (
  message: unknown,
  sender: infer TSender,
) => unknown
  ? TSender
  : never;

let recordingStore: RecordingStore | null = null;

export const initializeMessageRouter = (browserApi: BrowserApi): void => {
  recordingStore = createRecordingStore(browserApi);

  browserApi.runtime.onMessage.addListener(
    (
      message: unknown,
      sender: RuntimeMessageSender,
    ): ExtensionResponseMessage | Promise<ExtensionResponseMessage | undefined> | undefined => {
      if (!isExtensionRequestMessage(message)) {
        return undefined;
      }

      return handleExtensionMessage(message, sender);
    },
  );
};

const getRecordingStore = (): RecordingStore => {
  if (!recordingStore) {
    throw new Error('Recording store has not been initialized.');
  }

  return recordingStore;
};

const handleExtensionMessage = async (
  message: ExtensionRequestMessage,
  sender: RuntimeMessageSender,
): Promise<ExtensionResponseMessage | undefined> => {
  const store = getRecordingStore();

  switch (message.type) {
    case MessageType.Ping:
      return {
        type: MessageType.Pong,
        payload: {
          source: 'background',
          receivedAt: Date.now(),
        },
      };

    case MessageType.ContentScriptReady:
      if (typeof sender.tab?.id === 'number') {
        await store.notifyTab(sender.tab.id);
      }
      return undefined;

    case MessageType.RecordingStateRequest:
      return {
        type: MessageType.RecordingStateResponse,
        payload: await store.getState(),
      };

    case MessageType.RecordingCommandRequest:
      return {
        type: MessageType.RecordingStateResponse,
        payload: await store.dispatch(message.payload.command),
      };
  }
};
