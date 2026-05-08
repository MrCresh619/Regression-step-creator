export const sidebarStyles = String.raw`
:host {
  color-scheme: light dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

button {
  font: inherit;
}

.rr-shell {
  position: fixed;
  inset-block: 0;
  right: 0;
  z-index: 2147483647;
  display: flex;
  width: var(--rr-sidebar-width);
  max-width: calc(100vw - 24px);
  color: #0f172a;
  pointer-events: auto;
  transition: width 180ms ease, transform 180ms ease;
  contain: layout style paint;
}

.rr-shell--collapsed {
  width: 56px;
}

.rr-panel {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(248, 250, 252, 0.96);
  box-shadow: -24px 0 60px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(16px);
}

.rr-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -5px;
  width: 10px;
  cursor: ew-resize;
  touch-action: none;
}

.rr-resize-handle::after {
  position: absolute;
  top: 50%;
  left: 4px;
  width: 2px;
  height: 56px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.42);
  content: "";
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 120ms ease;
}

.rr-resize-handle:hover::after,
.rr-shell--resizing .rr-resize-handle::after {
  opacity: 1;
}

.rr-shell--collapsed .rr-resize-handle {
  display: none;
}

.rr-header {
  flex: 0 0 auto;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  padding: 16px;
}

.rr-header-row,
.rr-footer-row,
.rr-step-meta,
.rr-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rr-kicker {
  margin: 0 0 4px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rr-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.rr-subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.rr-icon-button {
  display: inline-flex;
  height: 36px;
  min-width: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
}

.rr-icon-button:hover {
  border-color: rgba(37, 99, 235, 0.55);
  background: #eff6ff;
}

.rr-icon-button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.rr-status-card {
  margin-top: 14px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  background: #ffffff;
  padding: 12px;
}

.rr-status-label {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.rr-status-value {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 800;
}

.rr-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 800;
}

.rr-badge::before {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  content: "";
}

.rr-badge--recording {
  background: #dcfce7;
  color: #166534;
}

.rr-badge--recording::before {
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.rr-badge--paused {
  background: #fef3c7;
  color: #92400e;
}

.rr-badge--paused::before {
  background: #f59e0b;
}

.rr-badge--stopped {
  background: #f1f5f9;
  color: #475569;
}

.rr-badge--stopped::before {
  background: #94a3b8;
}

.rr-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 14px 16px;
}

.rr-content::-webkit-scrollbar {
  width: 10px;
}

.rr-content::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: rgba(100, 116, 139, 0.45);
  background-clip: content-box;
}

.rr-step-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rr-step {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  background: #ffffff;
  padding: 12px;
}

.rr-step-index {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.rr-step-action {
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.rr-step-label {
  margin: 10px 0 0;
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
}

.rr-step-selector,
.rr-step-value {
  margin: 8px 0 0;
  overflow-wrap: anywhere;
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 11px;
  line-height: 1.45;
}

.rr-empty {
  display: grid;
  min-height: 260px;
  place-items: center;
  border: 1px dashed rgba(148, 163, 184, 0.75);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  padding: 24px;
  text-align: center;
}

.rr-empty-icon {
  display: inline-grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 16px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 24px;
}

.rr-empty-title {
  margin: 14px 0 0;
  font-size: 15px;
  font-weight: 900;
}

.rr-empty-text {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.rr-footer {
  position: sticky;
  bottom: 0;
  flex: 0 0 auto;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(248, 250, 252, 0.98);
  padding: 12px 16px;
}

.rr-footer-text {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.rr-collapsed-tab {
  display: none;
  width: 56px;
  height: 100%;
  align-items: center;
  justify-content: center;
  border: 0;
  border-left: 1px solid rgba(148, 163, 184, 0.45);
  background: #0f172a;
  color: #ffffff;
  cursor: pointer;
}

.rr-collapsed-label {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rr-shell--collapsed .rr-panel {
  display: none;
}

.rr-shell--collapsed .rr-collapsed-tab {
  display: flex;
}

@media (prefers-color-scheme: dark) {
  .rr-shell {
    color: #e2e8f0;
  }

  .rr-panel {
    border-left-color: rgba(51, 65, 85, 0.9);
    background: rgba(15, 23, 42, 0.96);
    box-shadow: -24px 0 60px rgba(0, 0, 0, 0.38);
  }

  .rr-header,
  .rr-footer {
    border-color: rgba(51, 65, 85, 0.9);
    background: rgba(15, 23, 42, 0.98);
  }

  .rr-subtitle,
  .rr-status-label,
  .rr-step-selector,
  .rr-step-value,
  .rr-empty-text,
  .rr-footer-text {
    color: #94a3b8;
  }

  .rr-icon-button,
  .rr-status-card,
  .rr-step,
  .rr-empty {
    border-color: rgba(51, 65, 85, 0.95);
    background: #1e293b;
    color: #e2e8f0;
  }

  .rr-icon-button:hover,
  .rr-step-index,
  .rr-empty-icon {
    background: rgba(37, 99, 235, 0.22);
  }

  .rr-title,
  .rr-status-value,
  .rr-step-label {
    color: #f8fafc;
  }

  .rr-step-action {
    background: #0f172a;
    color: #cbd5e1;
  }
}
`;
