import { createRecordedStep, findRecordableElement, shouldRecordInputChange } from './stepFactory';
import { SIDEBAR_HOST_ID } from '@/content/sidebar/constants';
import { RECORDER_STEP_LIMIT, type RecordedStep } from './types';
import type { RecordingState } from '@/shared/types';

type StepListener = (steps: RecordedStep[]) => void;

type PageStepRecorder = {
  destroy: () => void;
  getSteps: () => RecordedStep[];
  setRecordingState: (state: RecordingState) => void;
  subscribe: (listener: StepListener) => () => void;
};

const isSameStepTarget = (left: RecordedStep, right: RecordedStep): boolean =>
  left.action === right.action && left.selector === right.selector && left.value === right.value;

const isOverlayEvent = (event: Event): boolean =>
  event.composedPath().some((target) => target instanceof HTMLElement && target.id === SIDEBAR_HOST_ID);

export const createPageStepRecorder = (): PageStepRecorder => {
  let recordingState: RecordingState | null = null;
  let steps: RecordedStep[] = [];
  const listeners = new Set<StepListener>();

  const emit = (): void => {
    const snapshot = [...steps];
    listeners.forEach((listener) => {
      listener(snapshot);
    });
  };

  const appendStep = (step: RecordedStep): void => {
    const previousStep = steps.at(-1);
    if (previousStep && isSameStepTarget(previousStep, step) && step.createdAt - previousStep.createdAt < 500) {
      return;
    }

    steps = [...steps, step].slice(-RECORDER_STEP_LIMIT);
    emit();
  };

  const canRecord = (): boolean => Boolean(recordingState?.isRecording && !recordingState.isPaused);

  const handleClick = (event: MouseEvent): void => {
    if (!canRecord() || isOverlayEvent(event)) {
      return;
    }

    const element = findRecordableElement(event.target);
    if (!element) {
      return;
    }

    if (shouldRecordInputChange(element)) {
      return;
    }

    appendStep(createRecordedStep(element, 'click'));
  };

  const handleChange = (event: Event): void => {
    if (!canRecord() || isOverlayEvent(event)) {
      return;
    }

    const element = findRecordableElement(event.target);
    if (!element || !shouldRecordInputChange(element)) {
      return;
    }

    appendStep(createRecordedStep(element, 'input'));
  };

  document.addEventListener('click', handleClick, false);
  document.addEventListener('change', handleChange, true);

  return {
    destroy: () => {
      document.removeEventListener('click', handleClick, false);
      document.removeEventListener('change', handleChange, true);
      listeners.clear();
    },
    getSteps: () => [...steps],
    setRecordingState: (state: RecordingState): void => {
      const previousSessionId = recordingState?.currentSessionId ?? null;
      recordingState = state;

      if (state.currentSessionId && state.currentSessionId !== previousSessionId) {
        steps = [];
        emit();
      }
    },
    subscribe: (listener: StepListener): (() => void) => {
      listeners.add(listener);
      listener([...steps]);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
