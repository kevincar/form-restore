import { getPageData, saveFieldChange } from "../storage.js";
import type { ExtensionMessage } from "../types.js";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const typedMessage = message as ExtensionMessage;
  if (typedMessage.type === "SAVE_FIELD_CHANGE") {
    void saveFieldChange(
      chrome.storage.local,
      typedMessage.payload.url,
      typedMessage.payload.modalName,
      typedMessage.payload.fieldId,
      typedMessage.payload.value
    ).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (typedMessage.type === "GET_PAGE_DATA") {
    void getPageData(chrome.storage.local, typedMessage.payload.url).then((data) => sendResponse({ ok: true, data }));
    return true;
  }

  return false;
});
