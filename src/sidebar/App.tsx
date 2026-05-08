import type { ReactElement } from 'react';

export const SidebarApp = (): ReactElement => (
  <main className="min-h-screen bg-slate-50 p-4 text-slate-950">
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Sidebar</p>
      <h1 className="mt-1 text-xl font-bold">Regression Steps</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sidebar shell is ready for the recorder timeline and dnd-kit based step ordering.
      </p>
    </section>
  </main>
);
