import { startBackgroundWorker } from '@/background';

export default defineBackground(() => {
  startBackgroundWorker();
});
