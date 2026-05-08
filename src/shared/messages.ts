import type { RecordingCommand, RecordingState } from './types';

export const MessageType = {
  Ping: 'PING',
  Pong: 'PONG',
  ContentScriptReady: 'CONTENT_SCRIPT_READY',
  RecordingStateRequest: 'RECORDING_STATE_REQUEST',
  RecordingStateResponse: 'RECORDING_STATE_RESPONSE',
  RecordingCommandRequest: 'RECORDING_COMMAND_REQUEST',
  RecordingStateChanged: 'RECORDING_STATE_CHANGED',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];
export type MessageSource = 'popup' | 'content' | 'sidebar';

export type PingMessage = {
  type: typeof MessageType.Ping;
  payload: {
    source: MessageSource;
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

export type RecordingStateRequestMessage = {
  type: typeof MessageType.RecordingStateRequest;
};

export type RecordingStateResponseMessage = {
  type: typeof MessageType.RecordingStateResponse;
  payload: RecordingState;
};

export type RecordingCommandRequestMessage = {
  type: typeof MessageType.RecordingCommandRequest;
  payload: {
    command: RecordingCommand;
  };
};

export type RecordingStateChangedMessage = {
  type: typeof MessageType.RecordingStateChanged;
  payload: RecordingState;
};

export type ExtensionRequestMessage =
  | PingMessage
  | ContentScriptReadyMessage
  | RecordingStateRequestMessage
  | RecordingCommandRequestMessage;

export type ExtensionResponseMessage = PongMessage | RecordingStateResponseMessage;
export type ExtensionBroadcastMessage = RecordingStateChangedMessage;
export type ExtensionMessage = ExtensionRequestMessage | ExtensionResponseMessage | ExtensionBroadcastMessage;

const requestMessageTypes = new Set<MessageType>([
  MessageType.Ping,
  MessageType.ContentScriptReady,
  MessageType.RecordingStateRequest,
  MessageType.RecordingCommandRequest,
]);

const broadcastMessageTypes = new Set<MessageType>([MessageType.RecordingStateChanged]);

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

export const isExtensionBroadcastMessage = (value: unknown): value is ExtensionBroadcastMessage => {
  if (!isObject(value) || typeof value.type !== 'string') {
    return false;
  }

  return broadcastMessageTypes.has(value.type as MessageType);
};
