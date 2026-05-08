import { useMemo, useState, type CSSProperties, type PointerEvent, type ReactElement, type SyntheticEvent } from 'react';

import { SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from './constants';
import type { RecordedStep } from '@/content/steps/types';
import type { RecordingState } from '@/shared/types';

type SidebarOverlayProps = {
  recordingState: RecordingState | null;
  steps: RecordedStep[];
};

type RecordingDisplay = {
  label: string;
  badgeClassName: string;
  description: string;
};

const clampWidth = (width: number): number => Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH);

const formatTime = (timestamp: number): string =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);

const formatSessionId = (sessionId: string | null): string => {
  if (!sessionId) {
    return 'No active session';
  }

  return sessionId.length > 22 ? `${sessionId.slice(0, 10)}…${sessionId.slice(-8)}` : sessionId;
};

const getRecordingDisplay = (recordingState: RecordingState | null): RecordingDisplay => {
  if (!recordingState?.isRecording) {
    return {
      label: 'Stopped',
      badgeClassName: 'rr-badge rr-badge--stopped',
      description: 'Start recording from the extension popup to collect page interactions.',
    };
  }

  if (recordingState.isPaused) {
    return {
      label: 'Paused',
      badgeClassName: 'rr-badge rr-badge--paused',
      description: 'Recording is paused. Resume it to keep generating steps.',
    };
  }

  return {
    label: 'Recording',
    badgeClassName: 'rr-badge rr-badge--recording',
    description: 'Interactions on this page are being converted into regression steps.',
  };
};

const stopHostPropagation = (event: SyntheticEvent<HTMLElement>): void => {
  event.stopPropagation();
};

const StepItem = ({ index, step }: { index: number; step: RecordedStep }): ReactElement => (
  <li className="rr-step">
    <div className="rr-step-meta">
      <span className="rr-step-index">{index + 1}</span>
      <span className="rr-step-action">{step.action}</span>
    </div>
    <p className="rr-step-label">{step.label}</p>
    <p className="rr-step-selector">{step.selector}</p>
    {step.value ? <p className="rr-step-value">value: {step.value}</p> : null}
  </li>
);

const EmptyState = ({ isRecording }: { isRecording: boolean }): ReactElement => (
  <div className="rr-empty">
    <div>
      <span className="rr-empty-icon" aria-hidden="true">
        ✨
      </span>
      <p className="rr-empty-title">No generated steps yet</p>
      <p className="rr-empty-text">
        {isRecording
          ? 'Click buttons, links, inputs, or selects on the page and they will appear here live.'
          : 'The sidebar is ready. Start a recording to see generated steps in this panel.'}
      </p>
    </div>
  </div>
);

export const SidebarOverlay = ({ recordingState, steps }: SidebarOverlayProps): ReactElement => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const recordingDisplay = useMemo(() => getRecordingDisplay(recordingState), [recordingState]);
  const isRecording = Boolean(recordingState?.isRecording && !recordingState.isPaused);

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsResizing(true);
  };

  const handleResizePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (!isResizing) {
      return;
    }

    setWidth(clampWidth(window.innerWidth - event.clientX));
  };

  const handleResizePointerEnd = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsResizing(false);
  };

  return (
    <aside
      aria-label="Regression Test Recorder live steps"
      className={`rr-shell${isCollapsed ? ' rr-shell--collapsed' : ''}${isResizing ? ' rr-shell--resizing' : ''}`}
      onClick={stopHostPropagation}
      onDoubleClick={stopHostPropagation}
      onKeyDown={stopHostPropagation}
      onKeyUp={stopHostPropagation}
      onPointerDown={stopHostPropagation}
      style={{ '--rr-sidebar-width': `${width}px` } as CSSProperties}
    >
      <button
        type="button"
        className="rr-collapsed-tab"
        aria-label="Expand Regression Test Recorder sidebar"
        onClick={() => {
          setIsCollapsed(false);
        }}
      >
        <span className="rr-collapsed-label">Recorder</span>
      </button>

      <div
        className="rr-resize-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize Regression Test Recorder sidebar"
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerEnd}
        onPointerCancel={handleResizePointerEnd}
      />

      <section className="rr-panel">
        <header className="rr-header">
          <div className="rr-header-row">
            <div>
              <p className="rr-kicker">Live generated steps</p>
              <h2 className="rr-title">Regression Recorder</h2>
            </div>
            <button
              type="button"
              className="rr-icon-button"
              aria-label="Collapse Regression Test Recorder sidebar"
              onClick={() => {
                setIsCollapsed(true);
              }}
            >
              ›
            </button>
          </div>

          <div className="rr-status-card">
            <div className="rr-status-row">
              <div>
                <p className="rr-status-label">Status</p>
                <p className="rr-status-value">{recordingDisplay.description}</p>
              </div>
              <span className={recordingDisplay.badgeClassName}>{recordingDisplay.label}</span>
            </div>
          </div>
        </header>

        <div className="rr-content" aria-live="polite">
          {steps.length > 0 ? (
            <ol className="rr-step-list">
              {steps.map((step, index) => (
                <StepItem key={step.id} index={index} step={step} />
              ))}
            </ol>
          ) : (
            <EmptyState isRecording={isRecording} />
          )}
        </div>

        <footer className="rr-footer">
          <div className="rr-footer-row">
            <p className="rr-footer-text">{steps.length} steps captured</p>
            <p className="rr-footer-text" title={recordingState?.currentSessionId ?? undefined}>
              {formatSessionId(recordingState?.currentSessionId ?? null)}
            </p>
          </div>
          {recordingState?.updatedAt ? <p className="rr-footer-text">Updated {formatTime(recordingState.updatedAt)}</p> : null}
        </footer>
      </section>
    </aside>
  );
};
