import { pageKeyFromUrl } from "../content/dom.js";
import type { ExtensionMessage, ModalSnapshots } from "../types.js";

const statusElement = document.getElementById("status");
const savedDataElement = document.getElementById("saved-data");
const restoreToggle = document.getElementById("restore-toggle");

if (!(statusElement instanceof HTMLElement) || !(savedDataElement instanceof HTMLElement) || !(restoreToggle instanceof HTMLButtonElement)) {
  throw new Error("Popup markup is missing required elements.");
}

let activeTabId: number | null = null;
let pageData: ModalSnapshots = {};
let restoreActive = false;

const render = (): void => {
  const modalEntries = Object.entries(pageData);
  statusElement.textContent = modalEntries.length === 0 ? "No saved modal data for this page." : `${modalEntries.length} modal snapshot(s) saved.`;
  restoreToggle.disabled = modalEntries.length === 0 || activeTabId === null;
  restoreToggle.textContent = restoreActive ? "Cancel" : "Show Restored Data";
  restoreToggle.dataset.active = String(restoreActive);

  savedDataElement.replaceChildren(
    ...modalEntries.map(([modalName, fields]) => {
      const wrapper = document.createElement("article");
      wrapper.className = "modal-entry";

      const title = document.createElement("h2");
      title.textContent = modalName;

      const list = document.createElement("ul");
      Object.entries(fields).forEach(([fieldId, value]) => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const fieldValue = document.createElement("span");

        name.className = "field-name";
        fieldValue.className = "field-value";
        name.textContent = fieldId;
        fieldValue.textContent = String(value);

        item.append(name, fieldValue);
        list.append(item);
      });

      wrapper.append(title, list);
      return wrapper;
    })
  );
};

const sendToActiveTab = (message: ExtensionMessage): void => {
  if (activeTabId === null) {
    return;
  }

  chrome.tabs.sendMessage(activeTabId, message);
};

restoreToggle.addEventListener("click", () => {
  restoreActive = !restoreActive;
  sendToActiveTab(restoreActive ? { type: "START_RESTORE", payload: { data: pageData } } : { type: "CANCEL_RESTORE" });
  render();
});

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.id || !tab.url) {
    statusElement.textContent = "No active page found.";
    return;
  }

  activeTabId = tab.id;

  chrome.runtime.sendMessage(
    {
      type: "GET_PAGE_DATA",
      payload: {
        url: pageKeyFromUrl(tab.url)
      }
    } satisfies ExtensionMessage,
    (response) => {
      const typedResponse = response as { ok?: boolean; data?: ModalSnapshots } | undefined;
      pageData = typedResponse?.data ?? {};
      render();
    }
  );
});
