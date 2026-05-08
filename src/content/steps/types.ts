export const RECORDER_STEP_LIMIT = 100;

export type RecordedStepAction = 'click' | 'input' | 'select' | 'toggle';

export type RecordedStep = {
  id: string;
  action: RecordedStepAction;
  label: string;
  selector: string;
  value: string | null;
  url: string;
  createdAt: number;
};
