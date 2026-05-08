import { startBackgroundWorker } from '@/background';

export default defineBackground(() => {
  void startBackgroundWorker();
});
