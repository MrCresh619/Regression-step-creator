import type { browser } from 'wxt/browser';

import { getRecordingState, setRecordingState } from '@/storage/localDatabase';
import { MessageType, type RecordingStateChangedMessage } from '@/shared/messages';
import type { RecordingCommand, RecordingState } from '@/shared/types';
import { createInitialRecordingState, createRecordingSessionId } from '@/shared/types';

type BrowserTabs = Pick<typeof browser, 'tabs'>;

export type RecordingStore = {
  getState: () => Promise<RecordingState>;
  dispatch: (command: RecordingCommand) => Promise<RecordingState>;
  notifyTab: (tabId: number) => Promise<void>;
};

const applyRecordingCommand = (
  currentState: RecordingState,
  command: RecordingCommand,
  timestamp: number,
): RecordingState => {
  switch (command) {
    case 'start':
      if (currentState.isRecording) {
        return { ...currentState, isPaused: false, updatedAt: timestamp };
      }

      return {
        isRecording: true,
        isPaused: false,
        currentSessionId: createRecordingSessionId(),
        updatedAt: timestamp,
      };

    case 'stop':
      return {
        isRecording: false,
        isPaused: false,
        currentSessionId: null,
        updatedAt: timestamp,
      };

    case 'pause':
      if (!currentState.isRecording || currentState.isPaused) {
        return { ...currentState, updatedAt: timestamp };
      }

      return { ...currentState, isPaused: true, updatedAt: timestamp };

    case 'resume':
      if (!currentState.isRecording || !currentState.isPaused) {
        return { ...currentState, updatedAt: timestamp };
      }

      return { ...currentState, isPaused: false, updatedAt: timestamp };
  }
};

const createStateChangedMessage = (state: RecordingState): RecordingStateChangedMessage => ({
  type: MessageType.RecordingStateChanged,
  payload: state,
});

export const createRecordingStore = (browserApi: BrowserTabs): RecordingStore => {
  let state: RecordingState = createInitialRecordingState();
  let hydrationPromise: Promise<RecordingState> | null = null;
  let operationQueue: Promise<RecordingState> = Promise.resolve(state);

  const hydrate = async (): Promise<RecordingState> => {
    const persistedState = await getRecordingState();
    state = persistedState;
    return state;
  };

  const ensureHydrated = async (): Promise<RecordingState> => {
    hydrationPromise ??= hydrate();
    await hydrationPromise;
    return state;
  };

  const persist = async (nextState: RecordingState): Promise<RecordingState> => {
    state = await setRecordingState(nextState);
    return state;
  };

  const sendStateToTab = async (tabId: number, nextState: RecordingState): Promise<void> => {
    try {
      await browserApi.tabs.sendMessage(tabId, createStateChangedMessage(nextState));
    } catch {
      // The tab may not have the extension content script injected yet.
    }
  };

  const broadcast = async (nextState: RecordingState): Promise<void> => {
    const tabs = await browserApi.tabs.query({});
    await Promise.all(
      tabs.map(async (tab): Promise<void> => {
        if (typeof tab.id !== 'number') {
          return;
        }

        await sendStateToTab(tab.id, nextState);
      }),
    );
  };

  void ensureHydrated();

  return {
    getState: async () => ensureHydrated(),

    dispatch: async (command: RecordingCommand): Promise<RecordingState> => {
      operationQueue = operationQueue
        .catch(async (): Promise<RecordingState> => ensureHydrated())
        .then(async (): Promise<RecordingState> => {
          const hydratedState = await ensureHydrated();
          const nextState = applyRecordingCommand(hydratedState, command, Date.now());
          const persistedState = await persist(nextState);
          await broadcast(persistedState);
          return persistedState;
        });

      return operationQueue;
    },

    notifyTab: async (tabId: number): Promise<void> => {
      const currentState = await ensureHydrated();
      await sendStateToTab(tabId, currentState);
    },
  };
};
