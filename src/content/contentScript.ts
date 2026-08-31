import {
  addRestoreHighlights,
  getFieldId,
  getFieldValue,
  getModalName,
  pageKeyFromUrl,
  removeRestoreHighlights,
  restoreFieldFromData
} from "./dom.js";
import type { ExtensionMessage, ModalSnapshots } from "../types.js";

let restoreData: ModalSnapshots | null = null;

const saveChange = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const fieldId = getFieldId(target);
  const value = getFieldValue(target);
  if (!fieldId || value === null) {
    return;
  }

  chrome.runtime.sendMessage({
    type: "SAVE_FIELD_CHANGE",
    payload: {
      url: pageKeyFromUrl(window.location.href),
      modalName: getModalName(target),
      fieldId,
      value
    }
  } satisfies ExtensionMessage);
};

const restoreOnClick = (event: MouseEvent): void => {
  if (!restoreData || !(event.target instanceof Element)) {
    return;
  }

  if (restoreFieldFromData(event.target, restoreData)) {
    event.preventDefault();
    event.stopPropagation();
  }
};

document.addEventListener("input", saveChange, true);
document.addEventListener("change", saveChange, true);
document.addEventListener("click", restoreOnClick, true);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const typedMessage = message as ExtensionMessage;
  if (typedMessage.type === "START_RESTORE") {
    restoreData = typedMessage.payload.data;
    addRestoreHighlights(restoreData);
    sendResponse({ ok: true });
    return;
  }

  if (typedMessage.type === "CANCEL_RESTORE") {
    restoreData = null;
    removeRestoreHighlights();
    sendResponse({ ok: true });
  }
});
