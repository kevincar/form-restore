import type { FieldValue, ModalSnapshots } from "../types.js";

const RESTORE_CLASS = "modmed-restore-field";
const STYLE_ID = "modmed-restore-style";

export const pageKeyFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  parsedUrl.hash = "";
  return parsedUrl.toString();
};

export const getFieldId = (element: Element): string | null => {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
    return null;
  }

  return element.id || element.name || element.getAttribute("aria-label") || null;
};

export const getFieldValue = (element: Element): FieldValue | null => {
  if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
    return element.checked;
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    return element.value;
  }

  return null;
};

export const setFieldValue = (element: Element, value: FieldValue): boolean => {
  if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
    element.checked = Boolean(value);
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  if (
    typeof value === "string" &&
    (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
  ) {
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  return false;
};

export const getModalName = (element: Element): string => {
  const modal = element.closest("[role='dialog'], dialog, [aria-modal='true'], .modal, .Modal");
  if (!modal) {
    return "Page";
  }

  const labelledBy = modal.getAttribute("aria-labelledby");
  if (labelledBy) {
    const label = document.getElementById(labelledBy)?.textContent?.trim();
    if (label) {
      return label;
    }
  }

  const heading = modal.querySelector("h1, h2, h3, [data-modal-title]");
  const headingText = heading?.textContent?.trim();
  if (headingText) {
    return headingText;
  }

  return modal.id || modal.getAttribute("aria-label") || "Modal";
};

export const addRestoreHighlights = (data: ModalSnapshots): void => {
  ensureRestoreStyle();
  removeRestoreHighlights();

  Object.entries(data).forEach(([modalName, snapshot]) => {
    Object.keys(snapshot).forEach((fieldId) => {
      findField(modalName, fieldId)?.classList.add(RESTORE_CLASS);
    });
  });
};

export const removeRestoreHighlights = (): void => {
  document.querySelectorAll(`.${RESTORE_CLASS}`).forEach((element) => {
    element.classList.remove(RESTORE_CLASS);
  });
};

export const restoreFieldFromData = (element: Element, data: ModalSnapshots): boolean => {
  const fieldId = getFieldId(element);
  if (!fieldId) {
    return false;
  }

  const modalName = getModalName(element);
  const value = data[modalName]?.[fieldId];
  if (value === undefined) {
    return false;
  }

  return setFieldValue(element, value);
};

const findField = (modalName: string, fieldId: string): Element | null => {
  const candidates = Array.from(document.querySelectorAll("input, textarea, select"));
  return candidates.find((element) => getModalName(element) === modalName && getFieldId(element) === fieldId) ?? null;
};

const ensureRestoreStyle = (): void => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .${RESTORE_CLASS} {
      outline: 3px solid #f59e0b !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.25) !important;
    }
  `;
  document.head.append(style);
};
