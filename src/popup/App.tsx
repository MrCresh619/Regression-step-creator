import { useEffect, type ReactElement } from 'react';

import { usePopupStore } from './popupStore';

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

export const PopupApp = (): ReactElement => {
  const {
    checkConnection,
    connectionState,
    errorMessage,
    lastBackgroundResponseAt,
    loadRecorderStatus,
    recorderStatus,
  } = usePopupStore();

  useEffect(() => {
    void checkConnection();
    void loadRecorderStatus();
  }, [checkConnection, loadRecorderStatus]);

  return (
    <main className="w-[360px] space-y-4 bg-slate-50 p-4 text-slate-950">
      <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Foundation</p>
        <h1 className="mt-1 text-xl font-bold">Regression Test Recorder</h1>
        <p className="mt-2 text-sm text-slate-600">
          Stable WXT + React base for recording regression test steps.
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
            void loadRecorderStatus();
          }}
        >
          Refresh status
        </button>
      </section>

      <section className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200">
        <h2 className="font-semibold">Recorder status</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-slate-600">
          <dt>Recording</dt>
          <dd className="text-right font-medium text-slate-950">
            {recorderStatus?.isRecording ? 'Active' : 'Inactive'}
          </dd>
          <dt>Active tab ID</dt>
          <dd className="text-right font-medium text-slate-950">
            {recorderStatus?.activeTabId ?? 'Unknown'}
          </dd>
        </dl>
      </section>

      {errorMessage ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>
      ) : null}
    </main>
  );
};
