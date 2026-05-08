import { describeElement, createStableSelector } from './selector';
import type { RecordedStep, RecordedStepAction } from './types';

const interactiveSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
].join(',');

const createStepId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const isEditableElement = (element: Element): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
  element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;

const getControlValue = (element: Element): string | null => {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'password') {
      return '••••••••';
    }

    if (element.type === 'checkbox' || element.type === 'radio') {
      return element.checked ? 'checked' : 'unchecked';
    }

    return element.value || null;
  }

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    return element.value || null;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return element.textContent?.trim() || null;
  }

  return null;
};

const getActionForElement = (element: Element, fallback: RecordedStepAction): RecordedStepAction => {
  if (element instanceof HTMLSelectElement) {
    return 'select';
  }

  if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) {
    return 'toggle';
  }

  return fallback;
};

export const findRecordableElement = (target: EventTarget | null): Element | null => {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest(interactiveSelector);
};

export const createRecordedStep = (element: Element, fallbackAction: RecordedStepAction): RecordedStep => {
  const action = getActionForElement(element, fallbackAction);
  const label = describeElement(element);

  return {
    id: createStepId(),
    action,
    label,
    selector: createStableSelector(element),
    value: getControlValue(element),
    url: window.location.href,
    createdAt: Date.now(),
  };
};

export const shouldRecordInputChange = (element: Element): boolean =>
  isEditableElement(element) || (element instanceof HTMLElement && element.isContentEditable);
