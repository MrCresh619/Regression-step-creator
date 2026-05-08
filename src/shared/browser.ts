import { browser } from 'wxt/browser';

import type {
  ExtensionRequestMessage,
  ExtensionResponseMessage,
  RuntimeMessageResult,
} from './messaging';

export const sendRuntimeMessage = async <TResponse extends ExtensionResponseMessage>(
  message: ExtensionRequestMessage,
): Promise<RuntimeMessageResult<TResponse>> => {
  try {
    const response = (await browser.runtime.sendMessage(message)) as TResponse | undefined;

    return {
      ok: true,
      response: response ?? null,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      response: null,
      error: error instanceof Error ? error.message : 'Unknown runtime messaging error',
    };
  }
};
