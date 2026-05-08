import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    manifest_version: 3,
    name: 'Regression Test Recorder',
    short_name: 'Regression Recorder',
    description: 'Record browser interactions and prepare stable regression test steps.',
    version: '0.1.0',
    permissions: ['storage', 'tabs', 'activeTab', 'scripting'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Regression Test Recorder',
      default_popup: 'popup.html',
    },
    ...(browser === 'firefox'
      ? {
          sidebar_action: {
            default_title: 'Regression Test Recorder',
            default_panel: 'sidebar.html',
          },
          browser_specific_settings: {
            gecko: {
              id: 'regression-test-recorder@example.com',
              strict_min_version: '109.0',
            },
          },
        }
      : {
          side_panel: {
            default_path: 'sidebar.html',
          },
        }),
  }),
});
