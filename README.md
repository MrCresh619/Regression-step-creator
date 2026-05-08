# Regression Test Recorder

Production-oriented foundation for a Manifest V3 browser extension that records browser interactions and turns them into regression test steps.

## Architecture overview

- **WXT entrypoints** live in `src/entrypoints` and delegate to focused feature modules.
- **React UI** is split into `src/popup` and `src/sidebar` shells.
- **Background worker** owns runtime message routing and persistent recorder state hydration.
- **Content script** is registered on all URLs and announces the active page to the background worker.
- **Shared utilities** provide typed runtime messaging and browser API wrappers.
- **Storage** uses localForage behind a small persistence module.
- **Tailwind** styles are centralized in `src/styles/globals.css`.

## Local setup

```bash
npm install
npm run dev:chrome
npm run dev:firefox
```

## Production checks

```bash
npm run compile
npm run lint
npm run build:chrome
npm run build:firefox
```

## Packaging

```bash
npm run zip:chrome
npm run zip:firefox
```
