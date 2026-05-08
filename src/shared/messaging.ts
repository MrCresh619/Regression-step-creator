export const MessageType = {
  Ping: 'PING',
  Pong: 'PONG',
  ContentScriptReady: 'CONTENT_SCRIPT_READY',
  RecorderStatusRequest: 'RECORDER_STATUS_REQUEST',
  RecorderStatusResponse: 'RECORDER_STATUS_RESPONSE',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export type PingMessage = {
  type: typeof MessageType.Ping;
  payload: {
    source: 'popup' | 'content' | 'sidebar';
    sentAt: number;
  };
};

export type PongMessage = {
  type: typeof MessageType.Pong;
  payload: {
    source: 'background';
    receivedAt: number;
  };
};

export type ContentScriptReadyMessage = {
  type: typeof MessageType.ContentScriptReady;
  payload: {
    url: string;
    title: string;
  };
};

export type RecorderStatusRequestMessage = {
  type: typeof MessageType.RecorderStatusRequest;
};

export type RecorderStatusResponseMessage = {
  type: typeof MessageType.RecorderStatusResponse;
  payload: {
    isRecording: boolean;
    activeTabId: number | null;
  };
};

export type ExtensionRequestMessage =
  | PingMessage
  | ContentScriptReadyMessage
  | RecorderStatusRequestMessage;

export type ExtensionResponseMessage = PongMessage | RecorderStatusResponseMessage;
export type ExtensionMessage = ExtensionRequestMessage | ExtensionResponseMessage;

const requestMessageTypes = new Set<MessageType>([
  MessageType.Ping,
  MessageType.ContentScriptReady,
  MessageType.RecorderStatusRequest,
]);

export type RuntimeMessageResult<TResponse extends ExtensionResponseMessage> = {
  ok: boolean;
  response: TResponse | null;
  error: string | null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isExtensionRequestMessage = (value: unknown): value is ExtensionRequestMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  return requestMessageTypes.has(value.type as MessageType);
};
