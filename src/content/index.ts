import { MessageType } from '@/shared/messaging';
import { sendRuntimeMessage } from '@/shared/browser';

export const registerContentScript = (): void => {
  void sendRuntimeMessage({
    type: MessageType.ContentScriptReady,
    payload: {
      url: window.location.href,
      title: document.title,
    },
  });
};
