const selectorEscape = (value: string): string => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }

  return value.replace(/["\\]/g, '\\$&');
};

const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim();

const getElementLabel = (element: Element): string => {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return normalizeText(ariaLabel);
  }

  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelText = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ');

    if (normalizeText(labelText)) {
      return normalizeText(labelText);
    }
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    const label = element.labels?.item(0)?.textContent;
    if (label) {
      return normalizeText(label);
    }
  }

  const text = element.textContent;
  if (text) {
    return normalizeText(text).slice(0, 80);
  }

  return element.tagName.toLowerCase();
};

const getElementSelectorCandidate = (element: Element): string | null => {
  if (element.id) {
    return `#${selectorEscape(element.id)}`;
  }

  const testAttributes = ['data-testid', 'data-test', 'data-qa'] as const;
  for (const attribute of testAttributes) {
    const value = element.getAttribute(attribute);
    if (value) {
      return `[${attribute}="${selectorEscape(value)}"]`;
    }
  }

  const name = element.getAttribute('name');
  if (name) {
    return `${element.tagName.toLowerCase()}[name="${selectorEscape(name)}"]`;
  }

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return `${element.tagName.toLowerCase()}[aria-label="${selectorEscape(ariaLabel)}"]`;
  }

  return null;
};

const getNthOfTypeSelector = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();
  const parent = element.parentElement;

  if (!parent) {
    return tagName;
  }

  const siblings = Array.from(parent.children).filter((sibling) => sibling.tagName === element.tagName);
  const index = siblings.indexOf(element) + 1;

  return siblings.length > 1 ? `${tagName}:nth-of-type(${index})` : tagName;
};

export const createStableSelector = (element: Element): string => {
  const candidate = getElementSelectorCandidate(element);
  if (candidate) {
    return candidate;
  }

  const segments: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement && segments.length < 5) {
    const stableCandidate = getElementSelectorCandidate(current);
    if (stableCandidate) {
      segments.unshift(stableCandidate);
      break;
    }

    segments.unshift(getNthOfTypeSelector(current));
    current = current.parentElement;
  }

  return segments.length > 0 ? segments.join(' > ') : element.tagName.toLowerCase();
};

export const describeElement = (element: Element): string => getElementLabel(element) || element.tagName.toLowerCase();
