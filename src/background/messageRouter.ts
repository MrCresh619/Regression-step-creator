import type { browser } from 'wxt/browser';

import type { RecorderState } from '@/core/recorder';
import { createInitialRecorderState } from '@/core/recorder';
import { getRecorderState, setRecorderState } from '@/storage/localDatabase';
import type { ExtensionRequestMessage, ExtensionResponseMessage } from '@/shared/messaging';
import { isExtensionRequestMessage, MessageType } from '@/shared/messaging';

let recorderState: RecorderState = createInitialRecorderState();

type BrowserRuntime = Pick<typeof browser, 'runtime'>;
type RuntimeMessageSender = Parameters<typeof browser.runtime.onMessage.addListener>[0] extends (
  message: unknown,
  sender: infer TSender,
) => unknown
  ? TSender
  : never;

export const initializeMessageRouter = async (browserApi: BrowserRuntime): Promise<void> => {
  recorderState = await getRecorderState();

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

const handleExtensionMessage = async (
  message: ExtensionRequestMessage,
  sender: RuntimeMessageSender,
): Promise<ExtensionResponseMessage | undefined> => {
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
      recorderState = {
        ...recorderState,
        activeTabId: sender.tab?.id ?? recorderState.activeTabId,
        updatedAt: Date.now(),
      };
      await setRecorderState(recorderState);
      return undefined;

    case MessageType.RecorderStatusRequest:
      return {
        type: MessageType.RecorderStatusResponse,
        payload: {
          isRecording: recorderState.isRecording,
          activeTabId: recorderState.activeTabId,
        },
      };
  }
};
