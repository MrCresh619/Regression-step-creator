import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { SIDEBAR_HOST_ID } from './constants';
import { SidebarOverlay } from './SidebarOverlay';
import { sidebarStyles } from './sidebarStyles';
import type { RecordedStep } from '@/content/steps/types';
import type { RecordingState } from '@/shared/types';

type SidebarOverlayState = {
  recordingState: RecordingState | null;
  steps: RecordedStep[];
};

export type SidebarOverlayController = {
  destroy: () => void;
  updateRecordingState: (recordingState: RecordingState) => void;
  updateSteps: (steps: RecordedStep[]) => void;
};

const createHostElement = (): HTMLElement => {
  const existingHost = document.getElementById(SIDEBAR_HOST_ID);
  if (existingHost) {
    existingHost.remove();
  }

  const host = document.createElement('regression-recorder-sidebar');
  host.id = SIDEBAR_HOST_ID;
  host.style.setProperty('all', 'initial', 'important');
  host.style.setProperty('position', 'fixed', 'important');
  host.style.setProperty('inset', '0 0 auto auto', 'important');
  host.style.setProperty('z-index', '2147483647', 'important');
  host.style.setProperty('width', '0', 'important');
  host.style.setProperty('height', '0', 'important');
  host.style.setProperty('pointer-events', 'none', 'important');
  document.documentElement.append(host);

  return host;
};

const renderOverlay = (root: Root, state: SidebarOverlayState): void => {
  root.render(
    <React.StrictMode>
      <SidebarOverlay recordingState={state.recordingState} steps={state.steps} />
    </React.StrictMode>,
  );
};

export const createSidebarOverlay = (): SidebarOverlayController => {
  const host = createHostElement();
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const styleElement = document.createElement('style');
  const appRoot = document.createElement('div');
  const root = createRoot(appRoot);
  const state: SidebarOverlayState = {
    recordingState: null,
    steps: [],
  };

  styleElement.textContent = sidebarStyles;
  shadowRoot.append(styleElement, appRoot);
  renderOverlay(root, state);

  return {
    destroy: (): void => {
      root.unmount();
      host.remove();
    },
    updateRecordingState: (recordingState: RecordingState): void => {
      state.recordingState = recordingState;
      renderOverlay(root, state);
    },
    updateSteps: (steps: RecordedStep[]): void => {
      state.steps = steps;
      renderOverlay(root, state);
    },
  };
};
