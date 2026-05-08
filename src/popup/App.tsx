import { useEffect, type ReactElement } from 'react';

import { selectRecordingState, usePopupStore } from './popupStore';
import type { RecordingCommand } from '@/shared/types';

const formatTime = (timestamp: number | null): string => {
  if (!timestamp) {
    return 'Not checked yet';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);
};

const formatSessionId = (sessionId: string | null): string => {
  if (!sessionId) {
    return 'None';
  }

  return sessionId.length > 18 ? `${sessionId.slice(0, 8)}…${sessionId.slice(-6)}` : sessionId;
};

type RecorderControlButtonProps = {
  label: string;
  command: RecordingCommand;
  disabled: boolean;
  onCommand: (command: RecordingCommand) => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

const buttonClassByVariant: Record<NonNullable<RecorderControlButtonProps['variant']>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 disabled:bg-brand-200',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400 disabled:text-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-200',
};

const RecorderControlButton = ({
  command,
  disabled,
  label,
  onCommand,
  variant = 'secondary',
}: RecorderControlButtonProps): ReactElement => (
  <button
    type="button"
    className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${buttonClassByVariant[variant]}`}
    disabled={disabled}
    onClick={() => {
      onCommand(command);
    }}
  >
    {label}
  </button>
);

export const PopupApp = (): ReactElement => {
  const {
    actionState,
    checkConnection,
    connectionState,
    dispatchRecordingCommand,
    errorMessage,
    lastBackgroundResponseAt,
    loadRecordingState,
  } = usePopupStore();
  const recordingState = usePopupStore(selectRecordingState);
  const isUpdating = actionState === 'updating';

  useEffect(() => {
    void checkConnection();
    void loadRecordingState();
  }, [checkConnection, loadRecordingState]);

  const handleRecordingCommand = (command: RecordingCommand): void => {
    void dispatchRecordingCommand(command);
  };

  return (
    <main className="w-[360px] space-y-4 bg-slate-50 p-4 text-slate-950">
      <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Recorder controls</p>
        <h1 className="mt-1 text-xl font-bold">Regression Test Recorder</h1>
        <p className="mt-2 text-sm text-slate-600">
          Background script is the source of truth for recording state.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Background worker</h2>
            <p className="text-xs text-slate-500">Last response: {formatTime(lastBackgroundResponseAt)}</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {connectionState}
          </span>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          onClick={() => {
            void checkConnection();
            void loadRecordingState();
          }}
        >
          Refresh state
        </button>
      </section>

      <section className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recording state</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              recordingState.isRecording ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {recordingState.isRecording ? 'Recording' : 'Stopped'}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-3 text-slate-600">
          <dt>Recording</dt>
          <dd className="text-right font-medium text-slate-950">
            {recordingState.isRecording ? 'Active' : 'Inactive'}
          </dd>
          <dt>Paused</dt>
          <dd className="text-right font-medium text-slate-950">{recordingState.isPaused ? 'Yes' : 'No'}</dd>
          <dt>Session ID</dt>
          <dd className="text-right font-medium text-slate-950" title={recordingState.currentSessionId ?? undefined}>
            {formatSessionId(recordingState.currentSessionId)}
          </dd>
          <dt>Updated</dt>
          <dd className="text-right font-medium text-slate-950">{formatTime(recordingState.updatedAt)}</dd>
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <RecorderControlButton
            command="start"
            disabled={isUpdating || recordingState.isRecording}
            label="Start"
            onCommand={handleRecordingCommand}
            variant="primary"
          />
          <RecorderControlButton
            command="stop"
            disabled={isUpdating || !recordingState.isRecording}
            label="Stop"
            onCommand={handleRecordingCommand}
            variant="danger"
          />
          <RecorderControlButton
            command="pause"
            disabled={isUpdating || !recordingState.isRecording || recordingState.isPaused}
            label="Pause"
            onCommand={handleRecordingCommand}
          />
          <RecorderControlButton
            command="resume"
            disabled={isUpdating || !recordingState.isRecording || !recordingState.isPaused}
            label="Resume"
            onCommand={handleRecordingCommand}
          />
        </div>
      </section>

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>
      ) : null}
    </main>
  );
};
